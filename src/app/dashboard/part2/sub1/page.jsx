"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Select,
  MenuItem,
  Button,
  Typography,
  Grid,
  Paper,
  LinearProgress
} from "@mui/material";
import Waveform from "./Waveform";
import CodeContainer from './CodeContainer';

export default function Page() {
  const [module, setModule] = useState("module1");
  const [rtlCode, setRtlCode] = useState("");
  const [simulatorCode, setSimulatorCode] = useState("");
  const [rtlWaveformData, setRtlWaveformData] = useState(null);
  const [simulatorWaveformData, setSimulatorWaveformData] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState(["系统准备就绪"]);

  // 增强的模块代码数据
  const moduleCodeMap = {
    module1: {
      rtl: `// 加法器模块 RTL
module adder (
  input  wire [31:0] a,
  input  wire [31:0] b,
  output reg  [31:0] sum,
  input  wire        clk,
  input  wire        rst_n
);

always @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
    sum <= 32'h0;
  end else begin
    sum <= a + b;
  end
end

endmodule`,
      simulator: `# 加法器测试脚本
import random
from vedic import Adder

def test_adder():
    dut = Adder()

    for _ in range(10):
        a = random.randint(0, 100)
        b = random.randint(0, 100)
        dut.a.value = a
        dut.b.value = b

        dut.step()

        assert dut.sum.value == a + b
        print(f"Test passed: {a} + {b} = {dut.sum.value}")`
    },
    module2: {
      rtl: `// 乘法器模块 RTL
module multiplier (
  input  wire [15:0] a,
  input  wire [15:0] b,
  output reg  [31:0] product,
  input  wire        clk,
  input  wire        rst_n
);

always @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
    product <= 32'h0;
  end else begin
    product <= a * b;
  end
end

endmodule`,
      simulator: `# 乘法器测试脚本
import random
from vedic import Multiplier

def test_multiplier():
    dut = Multiplier()

    for _ in range(10):
        a = random.randint(0, 100)
        b = random.randint(0, 100)
        dut.a.value = a
        dut.b.value = b

        dut.step()

        assert dut.product.value == a * b
        print(f"Test passed: {a} * {b} = {dut.product.value}")`
    },
    module3: {
      rtl: `// 移位寄存器 RTL
module shift_register (
  input  wire        data_in,
  input  wire        clk,
  input  wire        rst_n,
  output reg  [7:0]  data_out
);

always @(posedge clk or negedge rst_n) begin
  if (!rst_n) begin
    data_out <= 8'h00;
  end else begin
    data_out <= {data_out[6:0], data_in};
  end
end

endmodule`,
      simulator: `# 移位寄存器测试脚本
from vedic import ShiftRegister

def test_shift_register():
    dut = ShiftRegister()
    test_data = [1,0,1,1,0,0,1,0]

    for bit in test_data:
        dut.data_in.value = bit
        dut.step()

    assert dut.data_out.value == 0b10011010
    print("Shift register test passed")`
    },
  };

  // 波形数据生成器
  const generateWaveformData = () => {
    const content = `rstn4444444444 rdy data en xxx xxx xxx xxx xxx
signal signal data signal signal signal signal signal signal
0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0
1 0 1 0 1 1 0 1 0 1
0 1 0 1 0 1 0 1 0 1
1 0 1 0 1 1 0 1 0 1
0 1 1 0 0 0 1 1 0 0
0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0
0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0
0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0
0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0
0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0
0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0
0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0 0 1 1 0 0
0 1 1 0 0 0 1 1 0 0
0 1 1 0 0 0 1 1 0 0
0 1 1 0 0 0 1 1 0 0
0 1 1 0 0 0 1 1 0 0
0 1 1 0 0 0 1 1 0 0
0 1 1 0 0 0 1 1 0 0
0 1 1 0 0 0 1 1 0 0
0 1 1 0 0 0 1 1 0 0
0 1 1 0 0 0 1 1 0 0
0 1 1 0 0 0 1 1 0 0`;
    return content;
  };

  // 运行流程控制
  const handleRun = async () => {
    setIsRunning(true);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 开始运行验证`]);

    try {
      setRtlWaveformData("");
      setSimulatorWaveformData("");
      setCurrentIndex(0);
      // 第一阶段：编译
      await mockProcess('RTL编译中...', 1500);
      await mockProcess('生成网表文件', 1000);

      // 第二阶段：仿真
      await mockProcess('启动仿真器', 800);
      await mockProcess('加载测试用例', 1200);

      // 第三阶段：结果生成
      const waveform = generateWaveformData();
      setRtlWaveformData(waveform);
      setSimulatorWaveformData(waveform);

      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ✅ 运行成功`]);
    } catch (err) {
      setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ❌ 运行失败: ${err}`]);
    } finally {
      setIsRunning(false);
    }
  };

  // 模拟异步操作
  const mockProcess = (message, delay) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
        resolve();
      }, delay);
    });
  };

  // 模块切换处理
  const handleModuleChange = (event) => {
    const selectedModule = event.target.value;
    setModule(selectedModule);
    setRtlCode(moduleCodeMap[selectedModule].rtl);
    setSimulatorCode(moduleCodeMap[selectedModule].simulator);
    setRtlWaveformData(null);
    setSimulatorWaveformData(null);
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] 切换模块: ${selectedModule}`]);
  };

  useEffect(() => {
    handleModuleChange({ target: { value: "module1" } });
  }, []);

  return (
    <Box sx={{ p: 3, backgroundColor: '#f5f6fa', minHeight: '100vh' }}>
      <Grid item xs={12} sx={{ mb: 3 }}>
            <Paper elevation={0} sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: '#f0f4f8',
              border: '1px solid #e0e0e0'
            }}>
              <Typography variant="body1" component="div" sx={{
                lineHeight: 1.6,
                color: '#2d3436',
                fontSize: '0.95rem',
                '& .red-bold': {
                  fontWeight: 600,
                  color: '#ff4444',
                  display: 'inline',
                  padding: '0 2px'
                },
                '& strong': {
                  fontWeight: 600
                }
              }}>
                <strong>考核指标</strong>
                <Box component="span" display="block">
                  ① 标准图遍历算法 PageRank 计算性能，性能功耗比
                </Box>
                <Box component="span" display="block">
                  ② 标准图挖掘算法 k-Clique 计算性能，性能功耗比
                </Box>
                <Box component="span" display="block">
                  ③ 标准图学习算法 GCN 计算性能，性能功耗比
                </Box>

                <strong>中期指标：</strong>
                <Box component="span" display="block">
                  ① 基于模拟器的图计算加速卡性能达到
                  <span className='red-bold'>100GTEPS，</span>
                  性能功耗比达到 <span className='red-bold'>2.5GTEPS/W</span>
                </Box>
                <Box component="span" display="block">
                  ② 基于模拟器的图计算加速卡性能达到
                  <span className='red-bold'>20GTSPS，</span>
                  性能功耗比达到 <span className='red-bold'>0.5GTSPS/W</span>
                </Box>
                <Box component="span" display="block">
                  ③ 基于模拟器的图计算加速卡性能达到
                  <span className='red-bold'>20GOPS，</span>
                  性能功耗比达到 <span className='red-bold'>0.5GOPS/W</span>
                </Box>

                <strong>完成时指标：</strong>
                <Box component="span" display="block">
                  ① 基于图计算加速芯片的加速卡性能达到
                  <span className='red-bold'>100GTEPS，</span>
                  性能功耗比达到 <span className='red-bold'>2.5GTEPS/W</span>
                </Box>
                <Box component="span" display="block">
                  ② 基于图计算加速芯片的加速卡性能达到
                  <span className='red-bold'>20GTSPS，</span>
                  性能功耗比达到 <span className='red-bold'>0.5GTSPS/W</span>
                </Box>
                <Box component="span" display="block">
                  ③ 基于图计算加速芯片的加速卡性能达到
                  <span className='red-bold'>20GOPS，</span>
                  性能功耗比达到 <span className='red-bold'>0.5GOPS/W</span>
                </Box>

                <strong>考核方式：</strong>
                <Box component="span" display="block">
                  采用Graph500标准数据集运行PageRank、k-Clique和GCN
                  代码，进行实际性能测试。基准系统采用
                  2023年11月立项时的最新软件版本，
                  运行环境依托主流处理器Intel Xeon Gold 6338 CPU
                </Box>

                <strong>数据集来源：</strong>
                <Box component="span" display="block">
                  采用Graph500标准数据集
                </Box>
              </Typography>
            </Paper>
        </Grid>
      <Grid container spacing={3}>
        {/* 控制区域 */}
        <Grid item xs={12} md={3}>
          <Paper elevation={3} sx={{ p: 2, borderRadius: 3 }}>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              mb: 2,
              color: 'secondary.main',
              borderBottom: '2px solid',
              borderColor: 'secondary.main',
              pb: 1
            }}>
              模块选择
            </Typography>

            <Select
              value={module}
              onChange={handleModuleChange}
              fullWidth
              disabled={isRunning}
              size="small"
            >
              <MenuItem value="module1">加法器模块</MenuItem>
              <MenuItem value="module2">乘法器模块</MenuItem>
              <MenuItem value="module3">移位寄存器</MenuItem>
            </Select>

            <Button
              fullWidth
              variant="contained"
              color="success"
              onClick={handleRun}
              sx={{ mt: 2, py: 1.5 }}
              disabled={isRunning}
            >
              {isRunning ? '验证运行中...' : '开始验证'}
            </Button>

            {isRunning && (
              <Box sx={{ mt: 2 }}>
                <LinearProgress color="success" />
{/*                 <Typography variant="caption" sx={{
                  color: 'text.secondary',
                  display: 'block',
                  mt: 1,
                  fontFamily: 'monospace'
                }}>
                  当前进度: {logs.length}/6 步骤
                </Typography> */}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* 代码展示区域 */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{
                p: 2,
                borderRadius: 3,
                height: 500
              }}>
                <Typography variant="h6" sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: 'secondary.main'
                }}>
                  RTL 代码
                </Typography>
                <CodeContainer
                  content={rtlCode}
                  height={400}
                  options={{
                    theme: 'vs-dark',
                    fontSize: 14,
                    minimap: { enabled: false }
                  }}
                />
              </Paper>
            </Grid>

            <Grid item xs={12} md={6}>
              <Paper elevation={3} sx={{
                p: 2,
                borderRadius: 3,
                height: 500
              }}>
                <Typography variant="h6" sx={{
                  fontWeight: 700,
                  mb: 2,
                  color: 'secondary.main'
                }}>
                  Simulator 代码
                </Typography>
                <CodeContainer
                  content={simulatorCode}
                  height={400}
                  options={{
                    theme: 'vs-dark',
                    language: 'python',
                    fontSize: 14,
                    minimap: { enabled: false }
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </Grid>

        {/* 波形展示区域 */}
        <Grid item xs={12}>
          <Paper elevation={3} sx={{
            p: 2,
            borderRadius: 3,
            minHeight: 400
          }}>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              mb: 2,
              color: 'secondary.main'
            }}>
              RTL 波形
            </Typography>
            <Waveform
              data={rtlWaveformData}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              height={300}
            />
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={3} sx={{
            p: 2,
            borderRadius: 3,
            minHeight: 400
          }}>
            <Typography variant="h6" sx={{
              fontWeight: 700,
              mb: 2,
              color: 'secondary.main'
            }}>
              Simulator 波形
            </Typography>
            <Waveform
              data={simulatorWaveformData}
              currentIndex={currentIndex}
              setCurrentIndex={setCurrentIndex}
              height={300}
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
