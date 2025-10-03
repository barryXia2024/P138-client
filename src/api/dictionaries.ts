
interface LocaleDictItem<T extends string | number = string> {
  value: T;
  dict?: Partial<Record<BasicTypes.Locale, { label: string; tip?: string }>>;
}

export type DictItem<T extends string | number> = {
  value: T;
  label: string;
  tip?: string;
};

export class LocaleDict<T extends string | number = string> {
  private readonly items: LocaleDictItem<T>[];
  private readonly map: Record<T, LocaleDictItem<T>>;
  constructor(items: LocaleDictItem<T>[]) {
    this.items = items;
    this.map = items.reduce((acc, item) => {
      acc[item.value as T] = item;
      return acc;
    }, {} as Record<T, LocaleDictItem<T>>);
  }

  getItem(key: T, locale: BasicTypes.Locale): DictItem<T> {
    const item = this.map[key];
    if (!item) {
      return { value: key, label: key.toString() };
    }
    const d = item.dict?.[locale] || item.dict?.[""]; //default locale
    return { value: key, label: d?.label ?? key.toString(), tip: d?.tip };
  }

  getItems(locale: BasicTypes.Locale): DictItem<T>[] {
    return this.items.map(({ value }) => this.getItem(value, locale));
  }

  getMap(locale: BasicTypes.Locale): Record<T, DictItem<T>> {
    return this.items.reduce((acc, item) => {
      acc[item.value] = this.getItem(item.value, locale);
      return acc;
    }, {} as Record<T, DictItem<T>>);
  }
}

const dictionaries = {
  "BasicTypes.Locale": new LocaleDict([{"value":""},{"value":"zh-CN"},{"value":"zh-TW"},{"value":"zh-HK"},{"value":"en-US"},{"value":"en-GB"},{"value":"en-AU"},{"value":"en-CA"},{"value":"en-IN"},{"value":"fr-FR"},{"value":"fr-CA"},{"value":"de-DE"},{"value":"de-CH"},{"value":"es-ES"},{"value":"es-MX"},{"value":"es-US"},{"value":"ja-JP"},{"value":"ko-KR"},{"value":"ru-RU"},{"value":"pt-BR"},{"value":"pt-PT"},{"value":"ar-SA"},{"value":"ar-EG"},{"value":"hi-IN"},{"value":"it-IT"},{"value":"it-CH"},{"value":"nl-NL"},{"value":"nl-BE"},{"value":"pl-PL"},{"value":"vi-VN"},{"value":"th-TH"},{"value":"el-GR"},{"value":"tr-TR"},{"value":"sv-SE"},{"value":"fil-PH"}]),
  "PkgRbacStaff.Status": new LocaleDict([{"value":0},{"value":1}]),
}

export default dictionaries;
