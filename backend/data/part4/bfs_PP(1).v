`timescale 1ns / 1ps
//////////////////////////////////////////////////////////////////////////////////
// Company:
// Engineer:
//
// Create Date: 05/19/2026
// Design Name:
// Module Name: BFS_pipeline
// Project Name:
// Target Devices:
// Tool Versions:
// Description:
//   BFS pipeline generated from the provided PageRank pipeline style.
//   control == 1: scatter; control == 2: gather.
//   output_word[63:32] = candidate distance.
//   output_word[31:0]  = destination vertex id.
// Dependencies:
//   No floating-point IP is required.
// Revision:
//   Revision 0.01 - File Created
// Additional Comments:
//   source_outcome[0] is interpreted as source active/frontier flag.
//   If your scheduler only sends edges of active frontier vertices,
//   set source_outcome[0] to 1'b1.
//   Gather performs min/update: write candidate only when candidate < dest_attr.
//////////////////////////////////////////////////////////////////////////////////

module bfs_PP # (
    parameter PIPE_DEPTH = 5,
    parameter URAM_DATA_W = 32,
    parameter PAR_SIZE_W = 10,
    parameter EDGE_W = 64,
    parameter BFS_INF = 32'h7fffffff
)(
    input wire                      clk,
    input wire                      rst,
    input wire [1:0]                control,

    input wire [URAM_DATA_W-1:0]    buffer_Din,
    input wire                      buffer_Din_valid,

    input wire [64-1:0]             Update_input_word,
    input wire [0:0]                Update_input_valid,

    input wire [31:0]               source_outcome,
    input wire [EDGE_W-1:0]         Edge_input_word,
    input wire [0:0]                Edge_input_valid,

    output wire [URAM_DATA_W-1:0]   buffer_Dout,
    output wire [PAR_SIZE_W-1:0]    buffer_Dout_Addr,
    output wire                     buffer_Dout_valid,

    output wire [63:0]              output_word,
    output wire [0:0]               output_valid,
    output wire [0:0]               par_active
);

    reg [31:0]       Vertex_source_outcome;
    reg [EDGE_W-1:0] Edge_input_word_reg;
    reg [0:0]        Edge_input_valid_reg;

    reg [64-1:0]     Update_input_word_reg;
    reg [0:0]        Update_input_valid_reg;

    wire             scatter_input_valid;
    wire             gather_input_valid;

    assign scatter_input_valid =
        Edge_input_valid_reg &&
        buffer_Din_valid &&
        (control == 2'd1);

    assign gather_input_valid =
        Update_input_valid_reg &&
        buffer_Din_valid &&
        (control == 2'd2);

    always @(posedge clk) begin
        if (rst) begin
            Edge_input_word_reg    <= {EDGE_W{1'b0}};
            Edge_input_valid_reg   <= 1'b0;
            Update_input_word_reg  <= 64'b0;
            Update_input_valid_reg <= 1'b0;
            Vertex_source_outcome  <= 32'b0;
        end else begin
            Edge_input_word_reg    <= Edge_input_word;
            Edge_input_valid_reg   <= Edge_input_valid;
            Update_input_word_reg  <= Update_input_word;
            Update_input_valid_reg <= Update_input_valid;
            Vertex_source_outcome  <= source_outcome;
        end
    end

    bfs_scatter_pipe # (
        .PIPE_DEPTH  (PIPE_DEPTH),
        .URAM_DATA_W (URAM_DATA_W),
        .BFS_INF     (BFS_INF)
    ) scatter_unit (
        .clk          (clk),
        .rst          (rst),
        .src_attr     (buffer_Din),
        .edge_dest    (Edge_input_word_reg[63:32]),
        .src_active   (Vertex_source_outcome[0]),
        .input_valid  (scatter_input_valid),
        .update_value (output_word[63:32]),
        .update_dest  (output_word[31:0]),
        .output_valid (output_valid)
    );

    bfs_gather_pipe # (
        .PIPE_DEPTH  (PIPE_DEPTH),
        .PAR_SIZE_W  (PAR_SIZE_W),
        .URAM_DATA_W (URAM_DATA_W),
        .BFS_INF     (BFS_INF)
    ) gather_unit (
        .clk          (clk),
        .rst          (rst),
        .update_value (Update_input_word_reg[63:32]),
        .update_dest  (Update_input_word_reg[31:0]),
        .dest_attr    (buffer_Din),
        .input_valid  (gather_input_valid),
        .WData        (buffer_Dout),
        .WAddr        (buffer_Dout_Addr),
        .Wvalid       (buffer_Dout_valid),
        .par_active   (par_active)
    );

endmodule

//------------------------------------------------------------------------------
// BFS gather pipeline
//------------------------------------------------------------------------------
// PageRank gather used addition:
//     new_rank = old_rank + incoming_contribution
// BFS gather uses a relaxation rule:
//     if candidate_level < current_level:
//         new_level = candidate_level
//     else:
//         no write is generated
// This makes BFS compatible with repeated or duplicated updates.
//------------------------------------------------------------------------------

module bfs_gather_pipe # (
    parameter PIPE_DEPTH = 3,
    parameter PAR_SIZE_W = 18,
    parameter URAM_DATA_W = 32,
    parameter BFS_INF = 32'h7fffffff
)(
    input wire                      clk,
    input wire                      rst,
    input wire [31:0]               update_value,
    input wire [31:0]               update_dest,

    input wire [URAM_DATA_W-1:0]    dest_attr,
    input wire [0:0]                input_valid,

    output wire [URAM_DATA_W-1:0]   WData,
    output wire [PAR_SIZE_W-1:0]    WAddr,
    output wire [0:0]               Wvalid,
    output wire [0:0]               par_active
);

    reg [0:0]  valid_reg  [PIPE_DEPTH-1:0];
    reg [31:0] dest_reg   [PIPE_DEPTH-1:0];
    reg [31:0] value_reg  [PIPE_DEPTH-1:0];
    reg [0:0]  active_reg [PIPE_DEPTH-1:0];

    wire [31:0] selected_value;
    wire        can_update;
    wire        input_is_valid;
    wire        dest_is_unvisited;
    wire        candidate_is_better;

    assign dest_is_unvisited   = (dest_attr[31:0] == BFS_INF);
    assign candidate_is_better = (update_value < dest_attr[31:0]);
    assign can_update          = input_valid && candidate_is_better;
    assign input_is_valid      = input_valid && (update_value != BFS_INF);
    assign selected_value      = update_value;

    assign WAddr      = dest_reg[PIPE_DEPTH-1][PAR_SIZE_W-1:0];
    assign WData      = value_reg[PIPE_DEPTH-1][URAM_DATA_W-1:0];
    assign Wvalid     = valid_reg[PIPE_DEPTH-1];
    assign par_active = active_reg[PIPE_DEPTH-1];

    integer i;

    always @(posedge clk) begin
        if (rst) begin
            for (i = 0; i < PIPE_DEPTH; i = i + 1) begin
                valid_reg[i]  <= 1'b0;
                dest_reg[i]   <= 32'b0;
                value_reg[i]  <= BFS_INF;
                active_reg[i] <= 1'b0;
            end
        end else begin
            for (i = 1; i < PIPE_DEPTH; i = i + 1) begin
                valid_reg[i]  <= valid_reg[i-1];
                dest_reg[i]   <= dest_reg[i-1];
                value_reg[i]  <= value_reg[i-1];
                active_reg[i] <= active_reg[i-1];
            end

            dest_reg[0]   <= update_dest;
            value_reg[0]  <= selected_value;
            valid_reg[0]  <= input_is_valid && can_update;
            active_reg[0] <= input_is_valid && can_update;
        end
    end

endmodule

//------------------------------------------------------------------------------
// BFS scatter pipeline
//------------------------------------------------------------------------------
// PageRank scatter used multiplication:
//     contribution = src_rank * reciprocal_out_degree
// BFS scatter emits one candidate distance for each outgoing edge:
//     candidate_distance = src_distance + 1
// The source is considered expandable only when:
//     input_valid == 1
//     source is active in the current frontier
//     src_attr is not BFS_INF
//------------------------------------------------------------------------------

module bfs_scatter_pipe # (
    parameter PIPE_DEPTH = 3,
    parameter URAM_DATA_W = 32,
    parameter BFS_INF = 32'h7fffffff
)(
    input wire                      clk,
    input wire                      rst,

    input wire [URAM_DATA_W-1:0]    src_attr,
    input wire [31:0]               edge_dest,
    input wire [0:0]                src_active,
    input wire [0:0]                input_valid,

    output wire [31:0]              update_value,
    output wire [31:0]              update_dest,
    output wire [0:0]               output_valid
);

    reg [31:0] dest_reg  [PIPE_DEPTH-1:0];
    reg [31:0] value_reg [PIPE_DEPTH-1:0];
    reg [0:0]  valid_reg [PIPE_DEPTH-1:0];

    wire [31:0] next_level;
    wire        src_is_valid;
    wire        level_can_inc;
    wire        scatter_fire;

    assign src_is_valid  = (src_attr[31:0] != BFS_INF);
    assign level_can_inc = (src_attr[31:0] != 32'hffffffff);
    assign scatter_fire  = input_valid && src_active && src_is_valid && level_can_inc;
    assign next_level    = src_attr[31:0] + 32'd1;

    assign update_dest   = dest_reg[PIPE_DEPTH-1];
    assign update_value  = value_reg[PIPE_DEPTH-1];
    assign output_valid  = valid_reg[PIPE_DEPTH-1];

    integer i;

    always @(posedge clk) begin
        if (rst) begin
            for (i = 0; i < PIPE_DEPTH; i = i + 1) begin
                dest_reg[i]  <= 32'b0;
                value_reg[i] <= BFS_INF;
                valid_reg[i] <= 1'b0;
            end
        end else begin
            for (i = 1; i < PIPE_DEPTH; i = i + 1) begin
                dest_reg[i]  <= dest_reg[i-1];
                value_reg[i] <= value_reg[i-1];
                valid_reg[i] <= valid_reg[i-1];
            end

            dest_reg[0]  <= edge_dest;
            value_reg[0] <= next_level;
            valid_reg[0] <= scatter_fire;
        end
    end

endmodule

//------------------------------------------------------------------------------
// Optional combinational helpers.
//------------------------------------------------------------------------------

module bfs_next_level # (
    parameter BFS_INF = 32'h7fffffff
)(
    input  wire [31:0] src_level,
    input  wire        src_active,
    input  wire        input_valid,
    output wire [31:0] candidate_level,
    output wire        candidate_valid
);

    wire src_visited;
    wire no_overflow;

    assign src_visited      = (src_level != BFS_INF);
    assign no_overflow      = (src_level != 32'hffffffff);
    assign candidate_level  = src_level + 32'd1;
    assign candidate_valid  = input_valid && src_active && src_visited && no_overflow;

endmodule

module bfs_relax # (
    parameter BFS_INF = 32'h7fffffff
)(
    input  wire [31:0] candidate_level,
    input  wire [31:0] old_level,
    input  wire        input_valid,
    output wire [31:0] new_level,
    output wire        write_valid,
    output wire        activate_vertex
);

    wire candidate_valid;
    wire candidate_better;
    wire old_unvisited;

    assign candidate_valid = (candidate_level != BFS_INF);
    assign candidate_better = (candidate_level < old_level);
    assign old_unvisited = (old_level == BFS_INF);
    assign new_level = candidate_level;
    assign write_valid = input_valid && candidate_valid && candidate_better;
    assign activate_vertex = write_valid || (input_valid && candidate_valid && old_unvisited);

endmodule

//------------------------------------------------------------------------------
// Notes for integration
//------------------------------------------------------------------------------
// 1. Initialize the source vertex level to 0 and all others to BFS_INF.
// 2. source_outcome[0] should be 1 only for active frontier vertices.
// 3. buffer_Din provides source level in scatter and destination level in gather.
// 4. buffer_Dout_valid indicates that the destination level should be updated.
// 5. par_active indicates that at least one new vertex becomes active.
// 6. External arbitration is still required for simultaneous writes.
// 7. Edge_input_word[63:32] is treated as destination id.
// 8. Edge_input_word[31:0] is ignored in this BFS datapath.
//------------------------------------------------------------------------------
