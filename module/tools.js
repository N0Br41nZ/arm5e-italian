import {
  ARM5E
} from "./metadata.js";

export function log(force, ...args) {
  try {
    const isDebugging = game.modules.get('_dev-mode')?.api?.getPackageDebugValue(ARM5E.MODULE_ID);

    if (force || isDebugging) {
      console.log(ARM5E.MODULE_ID, '|', ...args);
    }
  } catch (e) {
    console.log(e);
  }
}

export function compareBaseEffects(e1, e2) {
  if (e1.data.data.form.value < e2.data.data.form.value) {
      return -1;
  } else if (e1.data.data.form.value > e2.data.data.form.value) {
      return 1;
  } else {
      if (e1.data.data.technique.value < e2.data.data.technique.value) {
          return -1;
      } else if (e1.data.data.technique.value > e2.data.data.technique.value) {
          return 1;
      } else {
          if (e1.data.data.baseLevel < e2.data.data.baseLevel) {
              return -1;
          } else if (e1.data.data.baseLevel > e2.data.data.baseLevel) {
              return 1;
          } else {
              return e1.data.name.localeCompare(e2.data.name);
          }
      }
  }
}

export function compareMagicalEffects(e1, e2) {
  return compareMagicalEffectsData(e1.data,e2.data);
}

export function compareMagicalEffectsData(e1, e2) {
  if (e1.data.form.value < e2.data.form.value) {
      return -1;
  } else if (e1.data.form.value > e2.data.form.value) {
      return 1;
  } else {
      if (e1.data.technique.value < e2.data.technique.value) {
          return -1;
      } else if (e1.data.technique.value > e2.data.technique.value) {
          return 1;
      } else {
          if (e1.data.level < e2.data.level) {
              return -1;
          } else if (e1.data.level > e2.data.level) {
              return 1;
          } else {
              return e1.name.localeCompare(e2.name);
          }
      }
  }
}

export function compareSpells(e1, e2) {
  return compareSpellsData(e1.data,e2.data);
}
export function compareSpellsData(e1, e2) {
  if (e1.data.form.value < e2.data.form.value) {
      return -1;
  } else if (e1.data.form.value > e2.data.form.value) {
      return 1;
  } else {
      if (e1.data.technique.value < e2.data.technique.value) {
          return -1;
      } else if (e1.data.technique.value > e2.data.technique.value) {
          return 1;
      } else {
          if (e1.data.level < e2.data.level) {
              return -1;
          } else if (e1.data.level > e2.data.level) {
              return 1;
          } else {
              return e1.name.localeCompare(e2.name);
          }
      }
  }
}