import assert from "node:assert/strict";
import type { AnyCircuitElement } from "circuit-json";

/** Independent package-pin checks on the rendered design, including both mux banks. */
export function checkMotherboardNetlist(data: AnyCircuitElement[]) {
  const components = new Map(
    data
      .filter((e) => e.type === "source_component")
      .map((e) => [e.source_component_id, e]),
  );
  const nets = new Map(
    data
      .filter((e) => e.type === "source_net")
      .map((e) => [e.source_net_id, e.name]),
  );
  const ports = new Map(
    data
      .filter((e) => e.type === "source_port")
      .map((e) => [e.source_port_id, e]),
  );
  const assigned = new Map<string, Set<string>>();
  for (const trace of data.filter((e) => e.type === "source_trace")) {
    for (const id of trace.connected_source_port_ids) {
      const port = ports.get(id)!;
      assert(port.source_component_id, "Missing owner for " + id);
      const key =
        components.get(port.source_component_id)?.name + "." + port.pin_number;
      const names = assigned.get(key) ?? new Set<string>();
      for (const net of trace.connected_source_net_ids)
        names.add(nets.get(net)!);
      assigned.set(key, names);
    }
  }
  function check(ref: string, pins: Record<number, string>) {
    for (const [pin, net] of Object.entries(pins)) {
      assert.deepEqual(
        assigned.get(ref + "." + pin),
        new Set([net]),
        ref + "." + pin,
      );
    }
  }
  assert.equal(
    [...components.values()].find((e) => e.name === "U_CPU")
      ?.manufacturer_part_number,
    "RP2350A",
  );
  check("U_CPU", {
    1: "CPU_3V3",
    2: "UART_TX",
    3: "UART_RX",
    4: "USB_MODE",
    6: "CORE_1V1",
    11: "CPU_3V3",
    20: "CPU_3V3",
    21: "CORE_XIN",
    22: "CORE_XOUT",
    23: "CORE_1V1",
    24: "SWCLK",
    25: "SWDIO",
    26: "CPU_RUN",
    30: "CPU_3V3",
    38: "CPU_3V3",
    39: "CORE_1V1",
    44: "CPU_3V3",
    45: "CPU_3V3",
    46: "CORE_AVDD",
    47: "GND",
    48: "CORE_LX",
    49: "CPU_3V3",
    50: "CORE_1V1",
    51: "PHY_DM",
    52: "PHY_DP",
    53: "CPU_3V3",
    54: "CPU_3V3",
    55: "FLASH_IO3",
    56: "FLASH_CLK",
    57: "FLASH_IO0",
    58: "FLASH_IO2",
    59: "FLASH_IO1",
    60: "BOOTSEL",
    61: "GND",
  });
  check("U_FLASH", {
    1: "BOOTSEL",
    2: "FLASH_IO1",
    3: "FLASH_IO2",
    4: "GND",
    5: "FLASH_IO0",
    6: "FLASH_CLK",
    7: "FLASH_IO3",
    8: "CPU_3V3",
  });
  check("L_CORE", { 1: "CORE_1V1", 2: "CORE_LX" });
  check("U_LDO", { 1: "VBUS", 2: "GND", 3: "VBUS", 5: "CPU_3V3" });
  check("R_BOOT", { 1: "BOOTSEL", 2: "BOOT_PRESS" });
  check("SW_BOOT", { 1: "BOOT_PRESS", 2: "GND" });
  check("SW_RESET", { 1: "CPU_RUN", 2: "RESET_PRESS" });
  for (const [i, net] of ["CPU_3V3", "SWDIO", "SWCLK", "GND"].entries())
    check("TP_DBG" + (i + 1), { 1: net });
  check("R_USB_DP", { 1: "PHY_DP", 2: "CPU_DP" });
  check("R_USB_DM", { 1: "PHY_DM", 2: "CPU_DM" });
  check("TP_PWR1", { 1: "INPUT_5V" });
  check("SW_POWER", { 1: "GND", 2: "POWER_EN", 3: "INPUT_5V" });
  check("U_POWER", {
    1: "INPUT_5V",
    2: "GND",
    3: "POWER_EN",
    4: "POWER_CT",
    5: "VBUS",
    6: "VBUS",
  });
  check("R_POWER", { 1: "POWER_EN", 2: "GND" });
  check("SW_MODE", { 1: "GND", 2: "USB_MODE", 3: "CPU_3V3" });
  // TS3USB221A: S=0 joins common pins 8/7 to 1/2; S=1 joins them to 3/4.
  const select = {
    3: "PROG_DP",
    4: "PROG_DM",
    5: "GND",
    6: "GND",
    9: "USB_MODE",
    10: "CPU_3V3",
  };
  check("U_HOST_MUX", {
    ...select,
    1: "DP0",
    2: "DM0",
    7: "CPU_DM",
    8: "CPU_DP",
  });
  check("U_PC_MUX", {
    ...select,
    1: "CONSOLE_DP",
    2: "CONSOLE_DM",
    7: "PC_DM",
    8: "PC_DP",
  });
  check("U_PC", { 5: "CONSOLE_DP", 6: "CONSOLE_DM", 16: "PC_5V" });
  check("J1", {
    7: "PC_DM",
    8: "PC_DP",
    9: "PC_DM",
    10: "PC_DP",
    15: "PC_5V",
    16: "PC_5V",
  });
  check("U1", { 14: "DM0", 15: "DP0", 19: "VBUS" });
  for (let i = 1; i <= 4; i++) {
    check("J" + (i + 1), {
      7: "DM" + i,
      8: "DP" + i,
      9: "DM" + i,
      10: "DP" + i,
      15: "VBUS" + i,
      16: "VBUS" + i,
    });
    check("U1", { [13 - 2 * i]: "DM" + i, [14 - 2 * i]: "DP" + i });
  }
}
