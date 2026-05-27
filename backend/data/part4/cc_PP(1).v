`timescale 1ns / 1ps
//////////////////////////////////////////////////////////////////////////////////
// Company:
// Engineer:
//
// Create Date: 05/19/2026
// Design Name:
// Module Name: cc_PP
// Project Name:
// Target Devices:
// Tool Versions:
// Description:
//     Connected Components pipeline generated from the same PageRank-style
//     scatter/gather interface. The design keeps the two-phase execution model:
//       control == 1 : scatter source component labels through edges.
//       control == 2 : gather candidate labels and update destination labels.
//     Vertex attributes store current component labels. The gather stage writes
//     min(current_label, candidate_label). par_active is asserted when a write
//     actually changes a destination label.
//
// Dependencies:
//
// Revision:
// Revision 0.01 - File Created
// Additional Comments:
//     Update word layout:
//       output_word[63:32] = candidate component label
//       output_word[31:0]  = destination vertex id
//////////////////////////////////////////////////////////////////////////////////

module cc_PP # (
    parameter PIPE_DEPTH = 5,
    parameter URAM_DATA_W = 32,
    parameter PAR_SIZE_W = 10,
    parameter EDGE_W = 64,
    parameter USE_SRC_ACTIVE = 1
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

    reg [31:0]                      Vertex_source_outcome;
    reg [EDGE_W-1:0]                Edge_input_word_reg;
    reg [0:0]                       Edge_input_valid_reg;

    reg [64-1:0]                    Update_input_word_reg;
    reg [0:0]                       Update_input_valid_reg;

    wire [31:0]                     scatter_update_value;
    wire [31:0]                     scatter_update_dest;
    wire [0:0]                      scatter_output_valid;

    wire                            scatter_fire;
    wire                            gather_fire;

    assign scatter_fire = Edge_input_valid_reg &&
                          buffer_Din_valid &&
                          (control == 2'd1);

    assign gather_fire  = Update_input_valid_reg &&
                          buffer_Din_valid &&
                          (control == 2'd2);

    assign output_word  = {scatter_update_value, scatter_update_dest};
    assign output_valid = scatter_output_valid;

    always @(posedge clk) begin
        if (rst) begin
            Edge_input_word_reg      <= {EDGE_W{1'b0}};
            Edge_input_valid_reg     <= 1'b0;
            Update_input_word_reg    <= 64'b0;
            Update_input_valid_reg   <= 1'b0;
            Vertex_source_outcome    <= 32'b0;
        end else begin
            Edge_input_word_reg      <= Edge_input_word;
            Edge_input_valid_reg     <= Edge_input_valid;
            Update_input_word_reg    <= Update_input_word;
            Update_input_valid_reg   <= Update_input_valid;
            Vertex_source_outcome    <= source_outcome;
        end
    end

    cc_scatter_pipe # (
        .PIPE_DEPTH     (PIPE_DEPTH),
        .URAM_DATA_W    (URAM_DATA_W),
        .USE_SRC_ACTIVE (USE_SRC_ACTIVE)
    ) scatter_unit (
        .clk            (clk),
        .rst            (rst),
        .src_attr       (buffer_Din),
        .edge_dest      (Edge_input_word_reg[63:32]),
        .src_outcome    (Vertex_source_outcome),
        .input_valid    (scatter_fire),
        .update_value   (scatter_update_value),
        .update_dest    (scatter_update_dest),
        .output_valid   (scatter_output_valid)
    );

    cc_gather_pipe # (
        .PIPE_DEPTH     (PIPE_DEPTH),
        .PAR_SIZE_W     (PAR_SIZE_W),
        .URAM_DATA_W    (URAM_DATA_W)
    ) gather_unit (
        .clk            (clk),
        .rst            (rst),
        .update_value   (Update_input_word_reg[63:32]),
        .update_dest    (Update_input_word_reg[31:0]),
        .dest_attr      (buffer_Din),
        .input_valid    (gather_fire),
        .WData          (buffer_Dout),
        .WAddr          (buffer_Dout_Addr),
        .Wvalid         (buffer_Dout_valid),
        .par_active     (par_active)
    );

endmodule

module cc_scatter_pipe # (
    parameter PIPE_DEPTH = 3,
    parameter URAM_DATA_W = 32,
    parameter USE_SRC_ACTIVE = 1
)(
    input wire                      clk,
    input wire                      rst,

    input wire [URAM_DATA_W-1:0]    src_attr,
    input wire [31:0]               edge_dest,
    input wire [31:0]               src_outcome,
    input wire [0:0]                input_valid,

    output wire [31:0]              update_value,
    output wire [31:0]              update_dest,
    output wire [0:0]               output_valid
);

    reg [31:0]                      value_reg [PIPE_DEPTH-1:0];
    reg [31:0]                      dest_reg  [PIPE_DEPTH-1:0];
    reg [0:0]                       valid_reg [PIPE_DEPTH-1:0];

    wire                            src_is_active;
    wire                            fire;

    assign src_is_active = (USE_SRC_ACTIVE == 0) ? 1'b1 : src_outcome[0];
    assign fire          = input_valid && src_is_active;

    assign update_value  = value_reg[PIPE_DEPTH-1];
    assign update_dest   = dest_reg [PIPE_DEPTH-1];
    assign output_valid  = valid_reg[PIPE_DEPTH-1];

    integer i;

    always @(posedge clk) begin
        if (rst) begin
            for (i = 0; i < PIPE_DEPTH; i = i + 1) begin
                value_reg[i] <= 32'b0;
                dest_reg [i] <= 32'b0;
                valid_reg[i] <= 1'b0;
            end
        end else begin
            for (i = 1; i < PIPE_DEPTH; i = i + 1) begin
                value_reg[i] <= value_reg[i-1];
                dest_reg [i] <= dest_reg [i-1];
                valid_reg[i] <= valid_reg[i-1];
            end
            value_reg[0] <= src_attr[31:0];
            dest_reg [0] <= edge_dest;
            valid_reg[0] <= fire;
        end
    end

endmodule

module cc_gather_pipe # (
    parameter PIPE_DEPTH = 3,
    parameter PAR_SIZE_W = 18,
    parameter URAM_DATA_W = 32
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

    reg [31:0]                      cand_reg  [PIPE_DEPTH-1:0];
    reg [31:0]                      dest_reg  [PIPE_DEPTH-1:0];
    reg [31:0]                      attr_reg  [PIPE_DEPTH-1:0];
    reg [0:0]                       valid_reg [PIPE_DEPTH-1:0];

    wire [31:0]                     final_candidate;
    wire [31:0]                     final_dest;
    wire [31:0]                     final_attr;
    wire                            final_valid;
    wire                            should_update;
    wire [31:0]                     selected_value;

    assign final_candidate = cand_reg [PIPE_DEPTH-1];
    assign final_dest      = dest_reg [PIPE_DEPTH-1];
    assign final_attr      = attr_reg [PIPE_DEPTH-1];
    assign final_valid     = valid_reg[PIPE_DEPTH-1];

    assign should_update   = final_valid && (final_candidate < final_attr);
    assign selected_value  = should_update ? final_candidate : final_attr;

    assign WData           = selected_value;
    assign WAddr           = final_dest[PAR_SIZE_W-1:0];
    assign Wvalid          = should_update;
    assign par_active      = should_update;

    integer i;

    always @(posedge clk) begin
        if (rst) begin
            for (i = 0; i < PIPE_DEPTH; i = i + 1) begin
                cand_reg [i] <= 32'b0;
                dest_reg [i] <= 32'b0;
                attr_reg [i] <= 32'b0;
                valid_reg[i] <= 1'b0;
            end
        end else begin
            for (i = 1; i < PIPE_DEPTH; i = i + 1) begin
                cand_reg [i] <= cand_reg [i-1];
                dest_reg [i] <= dest_reg [i-1];
                attr_reg [i] <= attr_reg [i-1];
                valid_reg[i] <= valid_reg[i-1];
            end
            cand_reg [0] <= update_value;
            dest_reg [0] <= update_dest;
            attr_reg [0] <= dest_attr[31:0];
            valid_reg[0] <= input_valid;
        end
    end

endmodule

module cc_delay_valid # (
    parameter PIPE_DEPTH = 3
)(
    input wire                      clk,
    input wire                      rst,
    input wire                      din,
    output wire                     dout
);

    reg                             pipe [PIPE_DEPTH-1:0];
    integer                         i;

    assign dout = pipe[PIPE_DEPTH-1];

    always @(posedge clk) begin
        if (rst) begin
            for (i = 0; i < PIPE_DEPTH; i = i + 1) begin
                pipe[i] <= 1'b0;
            end
        end else begin
            for (i = 1; i < PIPE_DEPTH; i = i + 1) begin
                pipe[i] <= pipe[i-1];
            end
            pipe[0] <= din;
        end
    end

endmodule

module cc_delay_u32 # (
    parameter PIPE_DEPTH = 3
)(
    input wire                      clk,
    input wire                      rst,
    input wire [31:0]               din,
    output wire [31:0]              dout
);

    reg [31:0]                      pipe [PIPE_DEPTH-1:0];
    integer                         i;

    assign dout = pipe[PIPE_DEPTH-1];

    always @(posedge clk) begin
        if (rst) begin
            for (i = 0; i < PIPE_DEPTH; i = i + 1) begin
                pipe[i] <= 32'b0;
            end
        end else begin
            for (i = 1; i < PIPE_DEPTH; i = i + 1) begin
                pipe[i] <= pipe[i-1];
            end
            pipe[0] <= din;
        end
    end

endmodule
