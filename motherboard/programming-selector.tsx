import { C, R } from "../common";
import { TS3USB221ARSER } from "../imports/C128396";
import { PCM12SMTR } from "../imports/C221841";
import { B3U_1000P } from "../imports/C231329";

// Both switches share S. TI TS3USB221A selects pair 1 when low and pair 2
// when high. The second switch disconnects the console bridge during flashing.
export function ProgrammingSelector() {
  return (
    <schematicsheet
      name="usb_mode"
      displayName="RUN / PROGRAM and BOOTSEL recovery"
      sheetSize="A4"
    >
      <TS3USB221ARSER
        name="U_HOST_MUX"
        pcbX={7.75}
        pcbY={6}
        schX={-6}
        schY={2}
        connections={{
          D_POS: "net.CPU_DP",
          D_NEG: "net.CPU_DM",
          "1D_POS": "net.DP0",
          "1D_NEG": "net.DM0",
          "2D_POS": "net.PROG_DP",
          "2D_NEG": "net.PROG_DM",
          S: "net.USB_MODE",
          N_OE: "net.GND",
          GND: "net.GND",
          VCC: "net.CPU_3V3",
        }}
      />
      <C
        name="C_HOST_MUX"
        x={7.75}
        y={3.5}
        schX={-6}
        schY={-4}
        value="100nF"
        a="net.CPU_3V3"
      />
      <TS3USB221ARSER
        name="U_PC_MUX"
        pcbX={10}
        pcbY={-20}
        schX={1}
        schY={2}
        connections={{
          D_POS: "net.PC_DP",
          D_NEG: "net.PC_DM",
          "1D_POS": "net.CONSOLE_DP",
          "1D_NEG": "net.CONSOLE_DM",
          "2D_POS": "net.PROG_DP",
          "2D_NEG": "net.PROG_DM",
          S: "net.USB_MODE",
          N_OE: "net.GND",
          GND: "net.GND",
          VCC: "net.CPU_3V3",
        }}
      />
      <C
        name="C_PC_MUX"
        x={7}
        y={-21}
        schX={1}
        schY={-4}
        value="100nF"
        a="net.CPU_3V3"
      />
      <PCM12SMTR
        name="SW_MODE"
        pcbX={15}
        pcbY={18}
        noConnect={["pin4"]}
        schX={8}
        schY={3}
        connections={{
          pin1: "net.GND",
          pin2: "net.USB_MODE",
          pin3: "net.CPU_3V3",
        }}
      />
      <R
        name="R_MODE"
        x={8}
        y={13}
        value="10k"
        a="net.USB_MODE"
        b="net.GND"
        schX={8}
        schY={-2}
      />
      <B3U_1000P
        name="SW_BOOT"
        pcbX={35.5}
        pcbY={-15.5}
        schX={-5}
        schY={-8}
        connections={{ pin1: "net.BOOT_PRESS", pin2: "net.GND" }}
      />
      <resistor
        name="R_BOOT"
        pcbX={36}
        pcbY={-18.25}
        schX={1}
        schY={-8}
        resistance="1k"
        footprint="0603"
        manufacturerPartNumber="0603WAF1001T5E"
        supplierPartNumbers={{ jlcpcb: ["C21190"] }}
        connections={{ pin1: "net.BOOTSEL", pin2: "net.BOOT_PRESS" }}
      />
      <silkscreentext
        text="RUN  /  PROG"
        pcbX={15}
        pcbY={21.3}
        fontSize={0.85}
      />
      <silkscreentext text="BOOT" pcbX={36.5} pcbY={-19.5} fontSize={0.85} />
    </schematicsheet>
  );
}
