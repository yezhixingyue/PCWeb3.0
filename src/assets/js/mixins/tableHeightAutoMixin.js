/**
 * @description: 页面表格高度自适应变化混合方法 --- 一、 页面中需有setHeight方法 (必有)
 *  ---包含列拖拽|列隐藏等功能(此功能需要在外部配置：
 * 1. tableColData      --- data中
 * 2. tableName: 'orderTable'      --- data中  操作列除外
 * 3. <TableInfoDefindHeaderColumnScope @onClick="onInfoClick" />       --- 组件 位置：header slot中
 * 4. <TableColumnItem v-for="colItem in tableColData.filter(it => it.show)" :key="colItem.label" :colItem='colItem' />      --- 组件
 * 5. @header-dragend='onHeaderDragend'      --- 表头
 * 6. ref="oElTable"      --- 表头
 * 7. :key="tableKey"      --- 表头
 * @param {*}
 * @return {*}
 */
import sortable from 'sortablejs';
import { debounce } from '@/assets/js/utils/throttle';
import { mapState } from 'vuex';

export default {
  data() {
    return {
      h: 0,
      sortItem: null,
      tableKey: this.$utils.getRandomRangeId(8),
      notify: null,
      hideColLabelList: [],
      localShowLabelList: [],
    };
  },
  watch: {
    h(val) {
      this.h = val;
      const oEl = document.getElementsByClassName('el-table')[0];
      if (oEl) oEl.style.maxHeight = `${val}px`;
    },
    hideColLabelList() {
      // console.log(this.hideColLabelList, 'hideColLabelList watch');
      this.tableColData = this.tableColData.map(it => {
        const _item = { ...it };
        if (this.hideColLabelList.includes(it.label)) _item.show = false;
        else _item.show = true;
        return _item;
      });
    },
    isLeftCollapse(bool) {
      const t = bool ? 700 : 450;
      setTimeout(() => {
        this.setHeightByDebounce();
      }, t);
    },
    curPathName() {
      if (this.notify) this.notify.close();
    },
  },
  computed: {
    ...mapState('layout', ['isLeftCollapse']),
    colLabels() {
      if (!this.tableColData) return [];
      return this.tableColData.map(it => it.label);
    },
    curShowColTableData() {
      if (!this.tableColData) return [];
      return this.tableColData.filter(it => it.show);
    },
    curPathName() {
      return this.$route?.name || '';
    },
  },
  methods: {
    getHeight(elementSelector, distance, wrapSelectorContent) {
      if (wrapSelectorContent) {
        const oWrapSelectorContent = document.querySelector(wrapSelectorContent);
        if (oWrapSelectorContent) return oWrapSelectorContent.offsetHeight - distance;
      }
      const oWrap = document.querySelector('#app > section > main');
      if (!oWrap) return 600;
      const oHeader = elementSelector ? document.querySelector(elementSelector) : null;
      const _diff = oHeader ? oWrap.offsetHeight - oHeader.offsetHeight : oWrap.offsetHeight;
      return _diff - distance;
    },
    initHeightAuto() {
      this.$nextTick(() => this.setHeightByDebounce());
      window.addEventListener('resize', this.setHeightByDebounce);
    },
    removeHeightAuto() {
      window.removeEventListener('resize', this.setHeightByDebounce);
    },
    onHeaderDragend(newWidth, oldWidth, column) { // 处理el-table表头拖动宽度和sort顺序拖动排序的相互干扰 需在表格头部设置该方法
      if (!this.tableColData) return;
      const t = this.tableColData.find(it => it.label === column.label);
      if (t) {
        if (t.width) t.width = `${newWidth}px`;
        if (t.minWidth) t.minWidth = `${newWidth}px`;
      }
      if (this.sortItem) {
        try {
          this.sortItem.destroy();
        // eslint-disable-next-line no-empty
        } catch (error) {

        }
        this.$nextTick(() => {
          this.commonTableSortMixin();
        });
      }
    },
    commonTableSortMixin() {
      if (!this.tableColData) return;
      const tbody = document.querySelector('.el-table__header thead tr');
      const ops = {
        // draggable: '.is-closable',
        onEnd: this.handleSortEnd,
      };
      try {
        this.sortItem = sortable.create(tbody, ops);
      // eslint-disable-next-line no-empty
      } catch (error) {

      }
    },
    handleSortEnd(e) {
      let oldIndex = e.oldIndex - 1;
      let newIndex = e.newIndex - 1;
      if (this.curShowColTableData.length < this.tableColData.length) {
        if (this.curShowColTableData[oldIndex]) {
          const _oldLabel = this.curShowColTableData[oldIndex].label;
          const i = this.tableColData.findIndex(it => it.label === _oldLabel);
          if (i >= 0) oldIndex = i;
          if (newIndex > 0) {
            const _newLabel = this.curShowColTableData[newIndex - 1].label;
            const _newI = this.tableColData.findIndex(it => it.label === _newLabel);
            if (_newI >= 0) newIndex = _newI + 1;
          }
        }
      }
      const temp = [...this.tableColData];
      const [item] = temp.splice(oldIndex, 1);
      temp.splice(newIndex, 0, item);
      this.tableColData = temp;
      this.tableKey = this.$utils.getRandomRangeId(8);
      this.$nextTick(() => {
        this.commonTableSortMixin();
      });
    },
    handleMountedAndActivated() { // mounted 及 activated 处理函数
      this.setHeightByDebounce = debounce(this.setHeight, 30);
      this.initHeightAuto();
      this.commonTableSortMixin();
      if (this.tableName) {
        let _list = JSON.parse(localStorage.getItem(this.tableName)) || [];
        if (_list.length > 0) {
          _list = _list.filter(it => this.colLabels.includes(it));
        }
        this.hideColLabelList = _list;
      }
    },
    handleDestroyAndDeactivated() { // beforeDestroy 及 deactivated 处理函数
      this.removeHeightAuto();
      if (this.sortItem) {
        try {
          this.sortItem.destroy();
        // eslint-disable-next-line no-empty
        } catch (error) {

        }
      }
    },
    onInfoClick() { // 设置列显示
      if (!this.tableColData) return;
      let offset = 160;
      // let maxH = 640;
      if (this.$refs.oElTable && this.$refs.oElTable.$el && this.$refs.oElTable.$el.offsetTop) {
        offset = this.$refs.oElTable.$el.offsetTop - 17;
        // maxH = this.$refs.oElTable.$el.offsetHeight + 40;
      }
      this.localShowLabelList = this.colLabels.filter(it => !this.hideColLabelList.includes(it)); // hideColLabelList 与 localShowLabelList 互为反集
      const onClose = () => { // 关闭
        if (this.notify) this.notify.close();
      };
      const onChange = (itemLable) => { // 复选框操作
        const i = this.localShowLabelList.findIndex(it => it === itemLable);
        if (i >= 0) this.localShowLabelList.splice(i, 1);
        else this.localShowLabelList.push(itemLable);
      };
      const onSubmit = () => { // 保存
        this.hideColLabelList = this.colLabels.filter(it => !this.localShowLabelList.includes(it));
        if (this.tableName) {
          localStorage.setItem(this.tableName, JSON.stringify(this.hideColLabelList));
        }
        onClose();
      };
      const onReset = () => { // 重置
        const _list = this.colLabels.filter(it => !this.localShowLabelList.includes(it));
        this.localShowLabelList.push(..._list);
      };
      const message = (
        <section class='content-box'>
          <main>
          <el-checkbox-group value={this.localShowLabelList}>
            {
              this.tableColData.map(it => (<el-checkbox onchange={() => onChange(it.label)} label={it.label} key={it.label}></el-checkbox>))
            }
          </el-checkbox-group>
          </main>
          <footer>
            <el-button onclick={onSubmit} type='primary'>保存</el-button>
            <el-button onclick={onClose} >关闭</el-button>
            <span class='span-title-blue' onclick={onReset}>重置</span>
            <p class='is-gray'>
              <span>1. 没有被选中的列将会被隐藏</span>
              <span>2. 列显示隐藏设置会缓存至本地，在不清除缓存或版本更新的情况下，下次打开会自动延续本次设置</span>
              <span>3. 中间列可左右拖动（不被缓存）</span>
            </p>
          </footer>
        </section>
      );
      this.notify = this.$notify({
        title: '设置列显示',
        customClass: 'mp-erp-table-column-show-setup-wrap',
        // dangerouslyUseHTMLString: true,
        duration: 0,
        message,
        offset,
      });
    },
  },
  mounted() {
    this.handleMountedAndActivated();
  },
  beforeDestroy() {
    this.handleDestroyAndDeactivated();
  },
  activated() {
    this.handleMountedAndActivated();
  },
  deactivated() {
    this.handleDestroyAndDeactivated();
  },
};
