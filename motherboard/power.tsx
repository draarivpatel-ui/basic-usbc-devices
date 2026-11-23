import { PCM12SMTR } from "../imports/C221841";
import { TPS22918DBVR } from "../imports/C131941";
import { C, R } from "../common";

// J1's PC_5V rail powers only the serial interface. Product power comes from TP_PWR1.
export function ProductPower() {
  return (
    <schematicsheet
      name="product_power"
      displayName="Product power switch"
      sheetSize="A4"
    >
      <net name="INPUT_5V" isPowerNet nominalTraceWidth={0.5} />
      <PCM12SMTR
        name="SW_POWER"
        pcbX={16.25}
        pcbY={-19.25}
        schX={-7}
        schY={1}
        noConnect={["pin4"]}
        connections={{
          pin1: "net.GND",
          pin2: "net.POWER_EN",
          pin3: "net.INPUT_5V",
        }}
      />
      <TPS22918DBVR
        name="U_POWER"
        pcbX={10.5}
        pcbY={-6.25}
        schX={1}
        schY={1}
        connections={{
          VIN: "net.INPUT_5V",
          GND: "net.GND",
          ON: "net.POWER_EN",
          CT: "net.POWER_CT",
          VOUT: "net.VBUS",
          QOD: "net.VBUS",
        }}
      />
      <R
        name="R_POWER"
        x={6.5}
        y={-6.0}
        schX={-4}
        schY={-3}
        value="10k"
        a="net.POWER_EN"
        b="net.GND"
      />
      <C
        name="C_POWER_IN"
        x={14.5}
        y={-7.5}
        schX={-4}
        schY={3}
        value="4.7uF"
        a="net.INPUT_5V"
      />
      <C
        name="C_POWER_OUT"
        x={6.5}
        y={-7.5}
        schX={5}
        schY={3}
        value="1uF"
        a="net.VBUS"
      />
      <capacitor
        name="C_POWER_CT"
        pcbX={14.0}
        pcbY={-6.25}
        schX={4}
        schY={-3}
        footprint="0402"
        capacitance="1nF"
        manufacturerPartNumber="0402B102K500NT"
        supplierPartNumbers={{ jlcpcb: ["C1523"] }}
        connections={{ pin1: "net.POWER_CT", pin2: "net.GND" }}
      />
      <silkscreentext text="OFF   ON" pcbX={15.0} pcbY={-16.4} fontSize={0.7} />
    </schematicsheet>
  );
}
