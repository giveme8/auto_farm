export const DEFAULT_CODE_TEMPLATE = `
// 支持的方法（API）：
// move(dir) // 'up'|'down'|'left'|'right'
// plant(type) // '{{crop.potato}}'|'{{crop.pumpkin}}'
// harvest()
// canHarvest()
// spawn(async ({ move, plant, harvest }) => { /* ... */ })
// changeCharacter(type)
// getPosition()
// getWorldSize()
// setWorldSize(size)
// createMaze(size)
//
// 下面是运行示例：

harvest()
move('right')
`;

export function getDefaultCode(cropNames = {}) {
  const potato = cropNames.potato || "potato";
  const pumpkin = cropNames.pumpkin || "pumpkin";
  return DEFAULT_CODE_TEMPLATE.replaceAll("{{crop.potato}}", potato).replaceAll(
    "{{crop.pumpkin}}",
    pumpkin
  );
}
