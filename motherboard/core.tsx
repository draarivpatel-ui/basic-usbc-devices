import { RP2350A } from "../imports/C42411118";
import { W25Q128JVSIQ } from "../imports/C113767";
import { ABM8_272_T3 } from "../imports/C20625731";
import { AP2112K_3_3TRG1 } from "../imports/C51118";
import { MWSA0402S_3R3MT } from "../imports/C408336";
import { B3U_1000P } from "../imports/C231329";

const capParts = {
  "100nF": ["0402", "CL05B104KO5NNNC", "C1525"],
  "4.7uF": ["0603", "CL10A475KO8NNNC", "C19666"],
  "1uF": ["0603", "CL10A105KB8NNNC", "C15849"],
  "15pF": ["0402", "0402CG150J500NT", "C1548"],
} as const;
const resParts = {
  "27": ["0402WGJ0270TCE", "C25156"],
  "33": ["TC0225B330JTCC", "C26085540"],
  "1k": ["0402WGF1001TCE", "C11702"],
  "10k": ["0402WGF1003TCE", "C25741"],
} as const;
type Placement = {
  name: string;
  x: number;
  y: number;
  a: string;
  rot?: number;
  sx: number;
  sy: number;
};
function Cap({
  name,
  x,
  y,
  a,
  rot = 0,
  sx,
  sy,
  value,
}: Placement & { value: keyof typeof capParts }) {
  const [footprint, mpn, id] = capParts[value];
  return (
    <capacitor
      name={name}
      pcbX={x}
      pcbY={y}
      pcbRotation={rot}
      schX={sx}
      schY={sy}
      capacitance={value}
      footprint={footprint}
      manufacturerPartNumber={mpn}
      supplierPartNumbers={{ jlcpcb: [id] }}
      connections={{ pin1: "net." + a, pin2: "net.GND" }}
    />
  );
}
function Res({
  name,
  x,
  y,
  a,
  b,
  rot = 0,
  sx,
  sy,
  value,
}: Placement & { value: keyof typeof resParts; b: string }) {
  const [mpn, id] = resParts[value];
  return (
    <resistor
      name={name}
      pcbX={x}
      pcbY={y}
      pcbRotation={rot}
      schX={sx}
      schY={sy}
      resistance={value}
      footprint="0402"
      manufacturerPartNumber={mpn}
      supplierPartNumbers={{ jlcpcb: [id] }}
      connections={{ pin1: "net." + a, pin2: "net." + b }}
    />
  );
}
// Supply clusters correspond to the RP2350A Minimal R4 bypass locations.
// Each row names the MCU pin(s) served by that capacitor.
const bypass = [
  [1, 17.5, 1.75, "CPU_3V3"],
  [6, 17.5, 0.7, "CORE_1V1"],
  [11, 17.5, -1.7, "CPU_3V3"],
  [20, 20.6, -5.4, "CPU_3V3"],
  [23, 23.8, -5.4, "CORE_1V1"],
  [30, 26.7, -5.4, "CPU_3V3"],
  [38, 28.6, 0, "CPU_3V3"],
  [39, 28.6, 1.3, "CORE_1V1"],
  [44, 28.6, 3, "CPU_3V3"],
  [53, 19.55, 5.65, "CPU_3V3"],
] as const;
export function ProcessorCore() {
  return (
    <>
      <schematicsheet
        name="rp2350_core"
        displayName="RP2350A and supply bypass"
        sheetSize="A4"
      >
        <RP2350A
          name="U_CPU"
          pcbX={23}
          pcbY={0}
          schX={-7}
          schY={0}
          noConnect={[
            "GPIO3",
            "GPIO4",
            "GPIO5",
            "GPIO6",
            "GPIO7",
            "GPIO8",
            "GPIO9",
            "GPIO10",
            "GPIO11",
            "GPIO12",
            "GPIO13",
            "GPIO14",
            "GPIO15",
            "GPIO16",
            "GPIO17",
            "GPIO18",
            "GPIO19",
            "GPIO20",
            "GPIO21",
            "GPIO22",
            "GPIO23",
            "GPIO24",
            "GPIO25",
            "GPIO26_ADC0",
            "GPIO27_ADC1",
            "GPIO28_ADC2",
            "GPIO29_ADC3",
          ]}
          connections={{
            GPIO0: "net.UART_TX",
            GPIO1: "net.UART_RX",
            GPIO2: "net.USB_MODE",
            IOVDD1: "net.CPU_3V3",
            IOVDD2: "net.CPU_3V3",
            IOVDD3: "net.CPU_3V3",
            IOVDD4: "net.CPU_3V3",
            IOVDD5: "net.CPU_3V3",
            IOVDD6: "net.CPU_3V3",
            ADC_AVDD: "net.CPU_3V3",
            USB_OTP_VDD: "net.CPU_3V3",
            QSPI_IOVDD: "net.CPU_3V3",
            DVDD1: "net.CORE_1V1",
            DVDD2: "net.CORE_1V1",
            DVDD3: "net.CORE_1V1",
            VREG_VIN: "net.CPU_3V3",
            VREG_AVDD: "net.CORE_AVDD",
            VREG_LX: "net.CORE_LX",
            VREG_FB: "net.CORE_1V1",
            VREG_PGND: "net.GND",
            GND: "net.GND",
            USB_DM: "net.PHY_DM",
            USB_DP: "net.PHY_DP",
            XIN: "net.CORE_XIN",
            XOUT: "net.CORE_XOUT",
            QSPI_SS: "net.BOOTSEL",
            QSPI_SCLK: "net.FLASH_CLK",
            QSPI_SD0: "net.FLASH_IO0",
            QSPI_SD1: "net.FLASH_IO1",
            QSPI_SD2: "net.FLASH_IO2",
            QSPI_SD3: "net.FLASH_IO3",
            SWDIO: "net.SWDIO",
            SWCLK: "net.SWCLK",
            RUN: "net.CPU_RUN",
          }}
        />
        {bypass.map(([pin, x, y, rail], i) => (
          <Cap
            key={pin}
            name={`C_CPU${pin}`}
            x={x}
            y={y}
            sx={-1 + (i % 3) * 4.5}
            sy={7 - 4 * Math.floor(i / 3)}
            value="100nF"
            a={rail}
          />
        ))}
      </schematicsheet>
      <schematicsheet
        name="rp2350_support"
        displayName="Flash, clock and core regulator"
        sheetSize="A4"
      >
        <W25Q128JVSIQ
          name="U_FLASH"
          pcbX={13.7}
          pcbY={7.4}
          schX={1}
          schY={8}
          connections={{
            pin1: "net.BOOTSEL",
            pin2: "net.FLASH_IO1",
            pin3: "net.FLASH_IO2",
            pin4: "net.GND",
            pin5: "net.FLASH_IO0",
            pin6: "net.FLASH_CLK",
            pin7: "net.FLASH_IO3",
            pin8: "net.CPU_3V3",
          }}
        />
        <Cap
          name="C_FLASH"
          x={17.7}
          y={11.2}
          sx={7}
          sy={8}
          value="100nF"
          a="CPU_3V3"
        />
        <Res
          name="R_FLASH_CS"
          x={9.75}
          y={11.75}
          sx={4}
          sy={8.8}
          value="10k"
          a="CPU_3V3"
          b="BOOTSEL"
        />
        <AP2112K_3_3TRG1
          name="U_LDO"
          pcbX={33}
          pcbY={7.8}
          schX={1}
          schY={3}
          noConnect={["pin4"]}
          connections={{
            pin1: "net.VBUS",
            pin2: "net.GND",
            pin3: "net.VBUS",
            pin5: "net.CPU_3V3",
          }}
        />
        <Cap
          name="C_LDO_IN"
          x={30}
          y={7.8}
          rot={90}
          sx={-2}
          sy={3}
          value="1uF"
          a="VBUS"
        />
        <Cap
          name="C_LDO_OUT"
          x={36.3}
          y={7.8}
          rot={90}
          sx={5}
          sy={3}
          value="1uF"
          a="CPU_3V3"
        />
        <MWSA0402S_3R3MT
          name="L_CORE"
          pcbX={25.2}
          pcbY={8.9}
          pcbRotation={90}
          schX={8}
          schY={2}
          connections={{ pin2: "net.CORE_LX", pin1: "net.CORE_1V1" }}
        />
        <Cap
          name="C_VREG_IN"
          x={26.5}
          y={5.0}
          sx={11}
          sy={4}
          value="4.7uF"
          a="CPU_3V3"
        />
        <Cap
          name="C_VREG_OUT"
          x={25.2}
          y={13}
          sx={11}
          sy={2}
          value="4.7uF"
          a="CORE_1V1"
        />
        <Res
          name="R_AVDD"
          x={29.7}
          y={5.55}
          sx={8}
          sy={-1}
          value="33"
          a="CPU_3V3"
          b="CORE_AVDD"
        />
        <Cap
          name="C_VREG_A"
          x={32.2}
          y={4.2}
          sx={11}
          sy={-1}
          value="4.7uF"
          a="CORE_AVDD"
        />

        <Res
          name="R_USB_DP"
          x={21.65}
          y={5.0}
          rot={180}
          sx={0}
          sy={-2}
          value="27"
          a="PHY_DP"
          b="CPU_DP"
        />
        <Res
          name="R_USB_DM"
          x={21.65}
          y={6.35}
          rot={180}
          sx={4}
          sy={-2}
          value="27"
          a="PHY_DM"
          b="CPU_DM"
        />
        <ABM8_272_T3
          loadCapacitance="10pF"
          name="Y_CPU"
          pcbX={22}
          pcbY={-9.4}
          schX={1}
          schY={-7}
          connections={{
            pin1: "net.CORE_XIN",
            pin2: "net.GND",
            pin3: "net.XTAL_OUT",
            pin4: "net.GND",
          }}
        />
        <Res
          name="R_XOUT"
          x={22.85}
          y={-6.85}
          sx={-2}
          sy={-7}
          value="1k"
          a="CORE_XOUT"
          b="XTAL_OUT"
        />
        <Cap
          name="C_XIN"
          x={18.6}
          y={-10.2}
          rot={180}
          sx={0}
          sy={-9}
          value="15pF"
          a="CORE_XIN"
        />
        <Cap
          name="C_XOUT"
          x={25.4}
          y={-8.6}
          sx={4}
          sy={-9}
          value="15pF"
          a="XTAL_OUT"
        />
        <B3U_1000P
          name="SW_RESET"
          pcbX={35.5}
          pcbY={-9.5}
          schX={9}
          schY={-7}
          connections={{ pin1: "net.CPU_RUN", pin2: "net.RESET_PRESS" }}
        />
        <Res
          name="R_RESET"
          x={36}
          y={-12.2}
          sx={12}
          sy={-7}
          value="1k"
          a="RESET_PRESS"
          b="GND"
        />
        <silkscreentext text="RESET" pcbX={35.5} pcbY={-6.8} fontSize={0.85} />
        <trace
          name="FLASH_SELECT"
          from=".U_CPU > .QSPI_SS"
          to=".U_FLASH > .pin1"
          width={0.16}
          pcbPath={[
            {
              x: -2.8,
              y: 4.52,
              via: true,
              fromLayer: "top",
              toLayer: "bottom",
            },
            { x: -8.95, y: 4.52 },
            {
              x: -11.205,
              y: 2.265,
              via: true,
              fromLayer: "bottom",
              toLayer: "top",
            },
          ]}
        />
        <trace
          name="IO_SUPPLY"
          from=".U_CPU > .IOVDD6"
          to=".U_CPU > .QSPI_IOVDD"
          width={0.18}
          pcbPath={[
            { x: -2.6, y: 2.8 },
            { x: -2.1, y: 2.3 },
            { x: -1.0, y: 2.3 },
            { x: -0.4, y: 2.9 },
          ]}
        />
        <trace
          name="IO_BYPASS_SUPPLY"
          from=".C_CPU53 > .pin1"
          to=".C_CPU1 > .pin1"
          width={0.2}
          pcbPath={[
            { x: -0.8, y: 0 },
            { x: -2.56, y: -1.76 },
          ]}
        />
        <trace
          name="USB_BYPASS_RETURN"
          from=".C_CPU53 > .pin2"
          to=".U_CPU > .VREG_PGND"
          width={0.2}
          pcbPath={[
            { x: 1.0, y: 0, via: true, fromLayer: "top", toLayer: "bottom" },
            { x: 2.65, y: 0 },
            {
              x: 5.85,
              y: -3.2,
              via: true,
              fromLayer: "bottom",
              toLayer: "top",
            },
          ]}
        />
        <trace
          name="VREG_GROUND"
          from=".U_CPU > .VREG_PGND"
          to=".U_CPU > .GND"
          width={0.2}
          pcbPath={[
            { x: 2.4, y: 2.3 },
            { x: 1.2, y: 1.1 },
          ]}
        />
        <trace
          name="USB_DP_TERMINATION"
          from=".U_CPU > .USB_DP"
          to=".R_USB_DP > .pin1"
          width={0.18}
          pcbPath={[
            { x: 0.4, y: 4.35 },
            { x: -0.25, y: 5 },
            { x: -0.84, y: 5.0 },
          ]}
        />
        <trace
          name="USB_DM_TERMINATION"
          from=".U_CPU > .USB_DM"
          to=".R_USB_DM > .pin1"
          width={0.18}
          pcbPath={[
            { x: 0.8, y: 4.9 },
            { x: -0.65, y: 6.35 },
            { x: -0.84, y: 6.35 },
          ]}
        />
        <trace
          name="CPU_XIN"
          from=".U_CPU > .XIN"
          to=".Y_CPU > .pin1"
          width={0.17}
          pcbPath={[
            { x: -0.8, y: -4.55 },
            { x: -1.04, y: -4.79 },
            { x: -1.04, y: -5.88 },
            { x: -3.65, y: -8.49 },
            { x: -3.65, y: -9.42 },
            { x: -2.82, y: -10.25 },
          ]}
        />
        <trace
          name="XTAL_LOAD_IN"
          from=".Y_CPU > .pin1"
          to=".C_XIN > .pin1"
          width={0.17}
          pcbPath={[{ x: -2.5, y: -0.85 }]}
        />
        <trace
          name="CPU_XOUT"
          from=".U_CPU > .XOUT"
          to=".R_XOUT > .pin1"
          width={0.17}
          pcbPath={[
            { x: -0.4, y: -5.85 },
            { x: -1.01, y: -6.46 },
          ]}
        />
        <trace
          name="XTAL_DRIVE"
          from=".R_XOUT > .pin2"
          to=".Y_CPU > .pin3"
          width={0.17}
          pcbPath={[{ x: 0.6, y: -0.09 }]}
        />
        <trace
          name="XTAL_LOAD_OUT"
          from=".Y_CPU > .pin3"
          to=".C_XOUT > .pin1"
          width={0.17}
          pcbPath={[{ x: 2.6, y: 0.85 }]}
        />
      </schematicsheet>
    </>
  );
}
