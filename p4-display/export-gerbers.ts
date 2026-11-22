import { mkdir, readFile, writeFile } from "node:fs/promises";
import { convertCircuitJsonToGerberFiles } from "circuit-json-to-gerber";
import type { AnyCircuitElement } from "circuit-json";

for (const name of ["video-player", "large-rgb"]) {
  const dir = "dist/p4-display";
  const data: AnyCircuitElement[] = JSON.parse(
    await readFile(dir + "/" + name + ".circuit.json", "utf8"),
  );
  // The Gerber converter interprets false as a solder-mask opening. Buried
  // copper has no corresponding mask film. Suppress mask openings there.
  for (const item of data) {
    if (item.type === "pcb_copper_pour" && item.layer.startsWith("inner")) {
      item.covered_with_solder_mask = true;
    }
  }
  const output = dir + "/" + name + "-gerbers";
  await mkdir(output, { recursive: true });
  for (const [file, contents] of Object.entries(
    convertCircuitJsonToGerberFiles(data),
  )) {
    await writeFile(output + "/" + file, contents);
  }
}
