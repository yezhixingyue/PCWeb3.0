<template>
  <section class="mp-quotation-part-list-comp-wrap">
    <header class="part-style-box" v-if="totalData.PartList.length > 1">
      <i>//</i>{{ partDataList[0].PartName }}
    </header>
    <div class="content van-hairline--top">
      <ul
        v-for="(part, index) of partDataList"
        :key="part.PartID + index"
        :class="index > 0 ? 'is-multy' : ''"
      >
        <!-- 部件数量 -->
        <li class="single-row-box" v-if="part.PartAmount.First > 1">
          <div class="attr-wrap">
            <span class="is-gray">数量：</span>
            <span
              >{{ part.PartAmount.First }}{{ part.Unit }}/{{
                totalData.Unit
              }}</span
            >
          </div>
        </li>
        <!-- 物料 物料品牌 -->
        <li
          class="single-row-box"
          v-if="part.Material.First && part.MaterialBrand.First"
        >
          <div class="attr-wrap">
            <span class="is-gray">物料：</span>
            <span>{{ getMaterial(part.Material, part.MaterialList) }}</span>
          </div>
          <!-- <div class="attr-wrap">
            <span class="is-gray">物料品牌：</span>
            <span>{{
              getMaterialBrand(part.MaterialBrand, part.BrandList)
            }}</span>
          </div> -->
        </li>
        <!-- 属性 -->
        <li class="single-row-box" v-if="part.PropertyList.length > 0">
          <div
            class="attr-wrap"
            v-for="item of part.PropertyList"
            :key="item.PropertyID"
          >
            <span class="is-gray">{{ item.PropertyName }}：</span>
            <span v-if="item.ValueType === 1"
              >{{ item.CustomerInputValue }}
              {{
                item.UserDefinedUnit
                  ? item.UserDefinedUnit
                  : $utils.getUnit(item.Unit)
              }}</span
            >
            <span v-else-if="item.ValueType === 2">
              {{ geAttrValue(item) }}
            </span>
          </div>
        </li>
        <!-- 尺寸组 -->
        <li class="single-row-box" v-if="part.SizePropertyList.length > 0">
          <div class="attr-wrap">
            <span class="is-gray">{{ part.SizeGroup.GroupName }}：</span>
            <span>{{ getSizeGroup(part.SizePropertyList, part) }}</span>
          </div>
        </li>
        <!-- 印刷属性 -->
        <li class="single-row-box" v-if="part.PrintTypeList.length > 0">
          <div
            class="attr-wrap"
            v-for="item of part.PrintTypeList"
            :key="item.PropertyID"
          >
            <span class="is-gray">{{ item.PropertyName }}：</span>
            <span v-if="item.ValueType === 1"
              >{{ item.CustomerInputValue }}
              {{
                item.UserDefinedUnit
                  ? item.UserDefinedUnit
                  : $utils.getUnit(item.Unit)
              }}</span
            >
            <span v-else-if="item.ValueType === 2">
              {{ geAttrValue(item) }}
            </span>
          </div>
        </li>
        <!-- 印刷属性组 -->
        <li class="multy-row-box" v-if="part.PrintPropertyGroupList.length > 0">
          <div
            v-for="Group of part.PrintPropertyGroupList"
            :key="Group.GroupID"
          >
            <span class="is-origin-point">{{ Group.GroupName }}</span>
            <div
              v-for="(list, i) of Group.PropertyList"
              :key="Group.GroupID + i"
              :class="i > 0 ? 'border--top' : ''"
            >
              <div
                class="attr-wrap"
                v-for="item of list.Second"
                :key="item.PropertyID"
              >
                <span class="is-gray">{{ item.PropertyName }}：</span>
                <span v-if="item.ValueType === 1"
                  >{{ item.CustomerInputValue }}
                  {{
                    item.UserDefinedUnit
                      ? item.UserDefinedUnit
                      : $utils.getUnit(item.Unit)
                  }}</span
                >
                <span v-else-if="item.ValueType === 2">
                  {{ geAttrValue(item) }}
                </span>
              </div>
            </div>
          </div>
        </li>
        <!-- 属性组 -->
        <li class="multy-row-box" v-if="part.PropertyGroupList.length > 0">
          <div v-for="Group of part.PropertyGroupList" :key="Group.GroupID">
            <span class="is-origin-point">{{ Group.GroupName }}</span>
            <div
              v-for="(list, i) of Group.PropertyList"
              :key="Group.GroupID + i"
              :class="i > 0 ? 'border--top' : ''"
            >
              <div
                class="attr-wrap"
                v-for="item of list.Second"
                :key="item.PropertyID"
              >
                <span class="is-gray">{{ item.PropertyName }}：</span>
                <span v-if="item.ValueType === 1"
                  >{{ item.CustomerInputValue }}
                  {{
                    item.UserDefinedUnit
                      ? item.UserDefinedUnit
                      : $utils.getUnit(item.Unit)
                  }}</span
                >
                <span v-else-if="item.ValueType === 2">
                  {{ geAttrValue(item) }}
                </span>
              </div>
            </div>
          </div>
        </li>
        <!-- 必选工艺 -->
        <ProductCraftShowComps
          v-if="part.CraftList.length > 0"
          :craftList="
            getCraftList(
              part.CraftList,
              part.PartCraftList2Req.First,
              'require'
            )
          "
        />
        <!-- 可选工艺 -->
        <ProductCraftShowComps
          title="可选工艺"
          v-if="part.CraftList.length > 0"
          :craftList="
            getCraftList(
              part.CraftList,
              part.PartCraftList2Req.First,
              'noRequire'
            )
          "
        />
      </ul>
    </div>
  </section>
</template>

<script>
import ProductCraftShowComps from './ProductCraftShowComps';

export default {
  props: {
    partDataList: {
      type: Array,
      default: () => [],
    },
    totalData: {
      type: Object,
      default: () => ({}),
    },
  },
  components: {
    ProductCraftShowComps,
  },
  methods: {
    getMaterial(Material, MaterialList) {
      const MaterialID = Material.First;
      const _t = MaterialList.find(it => it.MaterialID === MaterialID);
      if (_t) return _t.Name;
    },
    getMaterialBrand(MaterialBrand, BrandList) {
      const BrandID = MaterialBrand.First;
      const _t = BrandList.find(it => it.BrandID === BrandID);
      if (_t) return _t.BrandName;
    },
    geAttrValue(item) {
      if (item.CustomizedOptionValue) return item.CustomizedOptionValue;
      if (item.CustomerInputValue && item.OptionList.length > 0) {
        const _t = item.OptionList.find(
          _it => _it.OptionID === item.CustomerInputValue,
        );
        return _t.Value;
      }
      return item.CustomerInputValue;
    },
    getSizeGroup(list, part) {
      const _arr = [];
      const _unitArr = [];
      list.forEach(it => {
        // eslint-disable-next-line prettier/prettier
        const _t = part.SizeGroup.PropertyList.find(it1 => it1.PropertyID === it1.PropertyID);
        // eslint-disable-next-line prettier/prettier
        let _unit = _t ? _t.UserDefinedUnit ? _t.UserDefinedUnit : this.$utils.getUnit(_t.Unit) : '';
        _unit = _unit === '毫米' ? 'mm' : _unit;
        _arr.push(it.CustomerInputValue.toString());
        _unitArr.push(_unit);
      });
      const _unitList = [...new Set(_unitArr)]; // 去重后的单位数组
      if (_unitList.length === 1) return _arr.join(' * ') + _unitList[0];
      return _arr.map((it, i) => it + _unitArr[i]).join(' * ');
    },
    getCraftList(list1, list2, type) {
      if (!list1 || !list2) return [];
      let _target;
      if (type === 'require') {
        _target = list1.find(it => it.ChoiceType === 2);
      } else {
        _target = list1.find(it => it.ChoiceType === 1);
      }
      if (!_target) return [];
      const _idList = _target.CraftList.map(it => it.CraftID);
      return list2.filter(it => _idList.includes(it.CraftID));
    },
  },
};
</script>

<style lang="scss">
// @import "@/assets/css/Common/var.scss";
.mp-quotation-part-list-comp-wrap {
  margin-top: 25px !important;
  > header {
    // color: $--color-dark;
    font-weight: 700;
    font-size: 14px;
  }
  .content {
    &::after {
      border-style: dashed;
    }
    padding: 5px 0;
    > ul {
      padding-top: 12.5px;
      width: 100%;
      &.is-multy {
        border-top: 1px solid $--border-color;
      }
      > li {
        &.single-row-box {
          display: flex;
          flex-wrap: wrap;
        }
        &.multy-row-box {
          > div {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            > div {
              display: flex;
              flex-wrap: wrap;
              &.border--top {
                border-top: 1px dashed $--border-color;
              }
              > div {
                margin: 6px 0;
              }
            }

            > span {
              // color: $--color-dark;
              font-size: 13px;
              font-weight: 700;
              margin-bottom: 5px;
              &::before {
                top: 0.2px;
              }
            }
            margin-bottom: 12.5px;
          }
        }
      }
    }
    div.attr-wrap {
      min-width: 100px;
      margin-right: 30px;
      margin-bottom: 12.5px;
    }
  }
}
</style>
