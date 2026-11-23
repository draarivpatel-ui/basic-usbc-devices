# RP2350 USB Motherboard

An 80 × 46 mm, four-layer controller for an enclosure. The upper edge carries four downstream USB-C sockets. The lower edge carries the computer service socket. The RP2350A is soldered directly to the board in a 7 × 7 mm QFN-60 package. Leave room for the power harness at the underside pads. Four M2 clearance holes are on a 70 × 40 mm grid, at X = −38 and 32 mm, Y = ±20 mm from board center.

## Integration

- Supply regulated 5 V and ground at the two underside power pads. The edge-facing OFF/ON slider on the J1 edge enables a TPS22918 load switch between input power and the processor, hub and four device supplies. Its contacts only carry the enable signal. Budget 1 A at the input for the controller, hub, four 100 mA peripherals and startup margin. The computer port powers its USB-to-UART interface independently. A dual-supply translator isolates the UART when either rail is off.
- U_CPU uses the RP2350A internal core buck with an external 3.3 µH inductor, a dedicated 3.3 V regulator, a 12 MHz crystal and 16 MB of external QSPI flash. The exposed ground pad uses nine 0.25 mm plated holes. Specify filled and capped via-in-pad for assembly. [Raspberry Pi hardware design guide](https://datasheets.raspberrypi.com/rp2350/hardware-design-with-rp2350.pdf)
- In RUN, the processor hosts J2–J5 and J1 provides the 115200-baud runtime UART. Each downstream port has attachment detection, a current-limited power switch and ESD protection. The hub reports faults as a group. The optional indicator uses `firmware/hub/ch334f-status.bin`.
- In PROGRAM, two USB data switches connect the processor directly to J1. The example firmware reads the selector on GPIO2 and enters the USB boot ROM. Disconnect J1 before changing modes. With product power switched ON, select PROGRAM, reconnect J1, and copy the UF2 to the RP2350 drive. Return to RUN and press RESET.
- For recovery, disconnect J1, select PROGRAM, hold BOOT, press and release RESET, then release BOOT and reconnect J1. BOOT grounds QSPI chip-select through 1 kΩ during reset, including with blank flash or custom firmware.
- For SWD, connect the underside 3.3 V reference, SWDIO, SWCLK and ground pads. Apply product power. Select RUN when debugging the standalone example.
- SW_MODE is an internal C&K PCM12SMTR service slider. Both slider models rise 1.4 mm above the PCB. The tallest components rise 5.4 mm. The enclosure only needs a user opening for SW_POWER, on the same edge as J1. Provide travel along the edge and leave the underside SWD pads accessible for assembly. [Switch mechanical drawing](https://www.littelfuse.com/assetdocs/littelfuse-ck-slide-pcm-series-datasheet?assetguid=d2f6a96c-7a9a-4c4e-a5aa-4fe3075dffe5)

## Standalone program

The native example in `firmware/motherboard/main.c` identifies CDC devices by sending `id`. A USB potentiometer selects one of three built-in 480 × 320 drawings. A three-count deadband stabilizes each transition. The host coalesces knob changes during a frame and initializes a reconnected display. Edit `artwork()` to change the graphics. Rebuild with Pico SDK 2.3.1 and a CMake-supported Arm compiler.

```sh
cmake -S firmware/motherboard -B dist/host-fw -DPICO_NO_PICOTOOL=1
cmake --build dist/host-fw
```

| Console command | Reply |
| --- | --- |
| `id` | `DEVICE tscircuit motherboard 1.1.0` |
| `help` | Supported commands |
| `devices` | Connected serial device types and interface slots, followed by `OK` |
| `status` | `SCENE 1` through `SCENE 3`, or `SCENE 0` while waiting for a knob |

## Rebuild and check

```sh
bun motherboard/build.tsx
python3 verify-module-copper.py --check-shorts --directory dist/motherboard motherboard
bun motherboard/export.ts
```

Check first-article power-up, host enumeration, hot-plug recovery, per-port fault handling and USB signal quality before embedding the board in a product. USB eye diagrams and enclosure fit require hardware.
