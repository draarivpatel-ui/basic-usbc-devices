import { Circuit } from "tscircuit";
import { mkdir, writeFile } from "node:fs/promises";
import { runAllChecks } from "@tscircuit/checks";
import VideoPlayer from "./video-player.circuit";
import LargeRgb from "./large-rgb.circuit";
const designs = { "video-player": VideoPlayer, "large-rgb": LargeRgb };
for (const name of process.argv.slice(2).length
  ? process.argv.slice(2)
  : Object.keys(designs)) {
  const Board = designs[name as keyof typeof designs];
  if (!Board) throw Error("Unknown design " + name);
  const circuit = new Circuit();
  circuit.add(<Board />);
  await circuit.renderUntilSettled();
  const data = circuit.getCircuitJson();
  await mkdir("dist/p4-display", { recursive: true });
  await writeFile(
    "dist/p4-display/" + name + ".circuit.json",
    JSON.stringify(data),
  );
  const issues = [
    ...new Set(
      [
        ...data.filter((e) => /_error$|_warning$/.test(e.type)),
        ...(await runAllChecks(data)),
      ].map((e) => ("message" in e ? String(e.message) : e.type)),
    ),
  ];
  console.log(name, issues.length, issues.slice(0, 15));
  if (issues.length) process.exitCode = 1;
}
