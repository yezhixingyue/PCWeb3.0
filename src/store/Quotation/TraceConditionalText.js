/* eslint-disable object-curly-newline */
import { getNameFromListByIDs } from '@/assets/js/utils/utils';

const PropertyFixedType = [ // FixedType对应列表
  { ID: 0, Name: '已选项数' },
  { ID: 1, Name: '和' },
  { ID: 2, Name: '最小值' },
  { ID: 3, Name: '最大值' },
  { ID: 4, Name: '使用次数' },
  { ID: 5, Name: '最短边' },
  { ID: 6, Name: '最长边' },
  { ID: 7, Name: '常规尺寸' },
  { ID: 8, Name: '物料尺寸长' },
  { ID: 9, Name: '物料尺寸宽' },
  { ID: 10, Name: '选项' },
  { ID: 11, Name: '展开长' },
  { ID: 12, Name: '展开宽' },
  { ID: 13, Name: '最长展开边' },
  { ID: 14, Name: '最短展开边' },
  { ID: 15, Name: '大版印刷次数' },
  { ID: 16, Name: '大版幅面' },
  { ID: 17, Name: '原始物料数量' },
  { ID: 18, Name: '原始物料尺寸' },
  { ID: 19, Name: '满足条数' },
  { ID: 20, Name: '不满足条数' },
  { ID: 21, Name: '工艺费' },
  { ID: 22, Name: '横轴上限' },
  { ID: 23, Name: '横轴下限' },
  { ID: 24, Name: '竖轴上限' },
  { ID: 25, Name: '竖轴下限' },
  { ID: 26, Name: '报价方案' },
  { ID: 27, Name: '拼版长(含白边)' },
  { ID: 28, Name: '拼版宽(含白边)' },
  { ID: 29, Name: '印刷幅面物料损耗数量' },
  { ID: 30, Name: '大版拼数' },
  { ID: 31, Name: '物料费' },
  { ID: 32, Name: '数量' },
  { ID: 33, Name: '款数' },
  { ID: 34, Name: '总价' },
  { ID: 35, Name: '自定义' },
  { ID: 36, Name: '印刷幅面物料数量(不含损耗)' },
];

/**
 * 获取元素条件文件展示内容 -- 用于追溯交互条件的文字显示
 *
 * @param {*} { ElOriginData, OperatoText, value, PRLabel }  PRLabel： 前缀名称
 * @returns
 */
const getElementConditionTextByElOriginData = ({ ElOriginData, OperatoText, value, PRLabel }) => {
  if (ElOriginData.Element && !ElOriginData.HiddenToCustomer) {
    const { Name, Type, Unit, OptionAttribute, SwitchAttribute } = ElOriginData.Element;
    let label = `${PRLabel || ''}${Name}`;
    if (ElOriginData.FixedType || ElOriginData.FixedType === 0) {
      const t = PropertyFixedType.find(it => it.ID === ElOriginData.FixedType);
      if (t) label = `${label}${t.Name || ''}`;
      return `${label}${OperatoText}${value}`;
    }
    let _value = value;
    let _OperatoText = OperatoText;
    switch (Type) {
      case 1:
        _value = `${_value}${Unit || ''}`;
        break;
      case 2:
        if (OptionAttribute && Array.isArray(OptionAttribute.OptionList)) {
          if (Array.isArray(_value)) {
            _value = _value.map(it => getNameFromListByIDs(it, OptionAttribute.OptionList) || it).join('、');
          } else {
            _value = getNameFromListByIDs(_value, OptionAttribute.OptionList) || _value;
          }
        }
        break;
      case 3:
        if (SwitchAttribute && SwitchAttribute.Words && typeof _value === 'boolean') {
          _value = _value ? `选中${SwitchAttribute.Words || ''}` : `未选中${SwitchAttribute.Words || ''}`;
          _OperatoText = '';
        }
        break;

      default:
        break;
    }
    return `${label}${_OperatoText}${_value}`;
  }
  return '';
};

/**
 *  获取元素组条件显示内容
 *
 * @param {*} { ElOriginData, GroupOriginData, OperatoText, value }
 * @returns
 */
const getGroupConditionTextByGroupOriginData = ({ ElOriginData, GroupOriginData, OperatoText, value, PRLabel }) => {
  const { Name, IsNameHidden } = GroupOriginData.Group;
  const _PRLabel = PRLabel || '';
  const groupName = IsNameHidden ? _PRLabel : `${_PRLabel}${Name || ''}`;
  if (!ElOriginData) { // 元素组本身 目前只有元素组使用次数
    if (GroupOriginData.FixedType || GroupOriginData.FixedType === 0) {
      const _n = getNameFromListByIDs(GroupOriginData.FixedType, PropertyFixedType);
      return `${groupName}${_n || ''}${OperatoText}${value}`;
    }
    return '';
  }
  if (ElOriginData && ElOriginData.Element) {
    return getElementConditionTextByElOriginData({ ElOriginData, OperatoText, value, PRLabel: groupName });
  }
  return '';
};

const getCraftaConditionTextByCraftOriginData = ({ ElOriginData, GroupOriginData, CraftOriginData, OperatoText, value }) => { // 获取工艺条件展示文字
  const PRLabel = CraftOriginData.Craft.ShowName ? `工艺${CraftOriginData.Craft.ShowName}中` : '';
  if (GroupOriginData) return getGroupConditionTextByGroupOriginData({ ElOriginData, GroupOriginData, OperatoText, value, PRLabel });
  if (ElOriginData && ElOriginData.Element) return getElementConditionTextByElOriginData({ ElOriginData, OperatoText, value, PRLabel });
  if (PRLabel && CraftOriginData.CraftConditionText) return `${CraftOriginData.CraftConditionText}${CraftOriginData.Craft.ShowName}`;
  return '';
};

const getSizeConditionTextBySizeGroupOriginData = ({ SizeGroupOriginData, ElOriginData, OperatoText, value }) => { // 获取尺寸条件展示文字
  const { FixedType, SizeList, GroupInfo } = SizeGroupOriginData;
  if (!GroupInfo) return '';
  const { Name, IsNameHidden } = GroupInfo;
  const SizeName = IsNameHidden ? '' : (Name || '尺寸');
  if (FixedType || FixedType === 0) { // 最短边 最长边 自定义 常规尺寸等 后面2个需要特殊处理
    const FixedLabel = getNameFromListByIDs(FixedType, PropertyFixedType);
    if (FixedLabel) {
      if (FixedLabel === '自定义') {
        return `${SizeName}${value ? '为' : '不是'}${FixedLabel}尺寸`;
      }
      if (FixedLabel === '常规尺寸' && Array.isArray(SizeList)) {
        const optionLabel = getNameFromListByIDs(value, SizeList);
        if (optionLabel) {
          return `${SizeName}${OperatoText}${optionLabel}`;
        }
        return '';
      }
      return `${SizeName}${FixedLabel}${OperatoText}${value}`;
    }
  }
  if (ElOriginData && ElOriginData.Element) {
    return getElementConditionTextByElOriginData({ ElOriginData, OperatoText, value, PRLabel: SizeName });
  }
  return '';
};

const getMaterialConditionTextByMaterialOriginData = ({ MaterialOriginData, OperatoText, value }) => { // 获取物料文字展示
  if (MaterialOriginData && Array.isArray(MaterialOriginData.TypeList)) {
    const list = MaterialOriginData.TypeList.map(it => it.List).reduce((prev, next) => [...prev, ...next], []).filter(it => !it.HiddenToCustomer);
    const optionLabel = getNameFromListByIDs(value, list);
    if (optionLabel) {
      return `${MaterialOriginData.Name}${OperatoText}${optionLabel}`;
    }
  }
  return '';
};

/**
 * 根据传入的条件追溯数据信息汇总成文字返回
 *
 * @param {*} obj
 * @returns
 */
export const getConditionTextByControlItemData = (obj) => {
  if (!obj) return '';
  const { OperatoText, PropValueData, result } = obj;
  if (!OperatoText || !PropValueData || !result) return '';
  const { CraftOriginData, GroupOriginData, ElOriginData, SizeGroupOriginData, MaterialOriginData, value } = PropValueData;
  if (!CraftOriginData && !GroupOriginData && !ElOriginData && !SizeGroupOriginData && !MaterialOriginData) return '';
  if (ElOriginData && ElOriginData.Element && ElOriginData && !CraftOriginData && !GroupOriginData && !SizeGroupOriginData) { // 元素
    return getElementConditionTextByElOriginData({ ElOriginData, OperatoText, value });
  }
  if (!CraftOriginData && GroupOriginData && GroupOriginData.Group && !SizeGroupOriginData) { // 元素组
    return getGroupConditionTextByGroupOriginData({ ElOriginData, GroupOriginData, OperatoText, value });
  }
  if (CraftOriginData && CraftOriginData.Craft && CraftOriginData.Craft.HiddenToCustomer === false && !SizeGroupOriginData) { // 工艺
    return getCraftaConditionTextByCraftOriginData({ ElOriginData, GroupOriginData, CraftOriginData, OperatoText, value });
  }
  if (SizeGroupOriginData && !CraftOriginData && !GroupOriginData) { // 尺寸
    const temp = getSizeConditionTextBySizeGroupOriginData({ SizeGroupOriginData, ElOriginData, OperatoText, value });
    return temp;
  }
  if (MaterialOriginData) { // 物料
    return getMaterialConditionTextByMaterialOriginData({ MaterialOriginData, OperatoText, value });
  }
  return '';
};

export default {
  getConditionTextByControlItemData,
};
