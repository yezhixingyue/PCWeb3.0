<template>
  <section class="mp-pc-my-setting-certificate-page-wrap">
    <div class="title">
      <span class="blue-v-line is-bold is-black">证书管理</span>
    </div>
    <p class="filtrates">
      <SingleSelector v-model="CertificateTypeData" :optionList='CertificateType' title="证书类型" />
      <SingleSelector v-model="CertificateStatusData" :optionList='CertificateStatus' title="证书状态"/>
      <!-- <search-input-comp
        title="搜索名称"
        placeholder="请输入搜索关键词"
        :typeList="[['KeyWords', '']]"
        :requestFunc="getCertificateList"
        :changePropsFunc="setCondition4OrderList"
        :word="condition4OrderList.KeyWords"
        @reset="clearCondition4OrderList"
        :searchWatchKey="CertificateList"
      /> -->
      <section class="mp-common-comps-search-box">
        <span class="text">搜索名称：</span>
        <el-input
          size="small"
          @keyup.enter.native="getCertificateList()"
          v-model.trim='KeyWords'
          spellcheck="false"
          clearable
          @clear="getCertificateList"
          placeholder="请输入搜索关键词"
          type="text"
        />
        <el-button icon="el-icon-search" type="primary" @click="getCertificateList()"></el-button>
      </section>
      <el-button type="text" @click="addCertificateClick">+ 添加证书</el-button>
      <AddCertificateDialog
      :editItem="editItem" @succeed="getCertificateList"
      :visible.sync="addCertificateVisible"/>
    </p>

    <el-table stripe border height="500"
      :data="CertificateList" style="width: calc(100% - 16px)" class="ft-14-table">
      <el-table-column prop="CertificateName" label="名称" width="118" show-overflow-tooltip></el-table-column>
      <el-table-column prop="CertificateType" label="类型" width="114" show-overflow-tooltip>
        <template slot-scope="scope">{{ CertificateType.find(it => it.value === scope.row.CertificateType).label || '' }}</template>
      </el-table-column>
      <el-table-column label="有效期" width="110" show-overflow-tooltip>
        <span slot-scope="scope">{{ getConvertTimeFormat(scope.row.Expire) }}</span>
      </el-table-column>
      <el-table-column label="证书状态" show-overflow-tooltip width="96">
        <template slot-scope="scope">{{ CertificateStatus.find(it => it.value === scope.row.CertificateStatus).label || '' }}</template>
      </el-table-column>
      <el-table-column label="缩略图" width="181">
        <template slot-scope="scope">
          <div style="display: flex; justify-content: center;">
            <el-image v-for="it in scope.row.CertificatePics" :key="it"
              @click="checkClick(scope.row.CertificatePics, imgUrl+it)"
              :src="imgUrl+it"
              alt=""
              fit="cover"
            />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" show-overflow-tooltip width="156">
        <template slot-scope="scope">
          <template v-if="scope.row.CheckStatus === 0">
            <p class="is-orgin">未审核</p>
          </template>
          <template v-if="scope.row.CheckStatus === 1">
            已审核
          </template>
          <div v-if="scope.row.CheckStatus === 2">
            <p style="line-height: 1em; font-size: 12px;" class="is-pink">未通过</p>
            <p style="line-height: 1em; font-size: 11px;margin-top: 5px;" class="is-pink">{{scope.row.CheckRemark}}</p>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" show-overflow-tooltip width="168">
        <template slot-scope="scope">
          <el-button v-if="scope.row.CheckStatus !== 1" type="text" @click="editClick(scope.row)">编辑</el-button>
          <el-button v-if="scope.row.CheckStatus !== 1" type="text" @click="deleteClick(scope.row)" class="is-pink">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <footer>
      <Count
        :watchPage='condition4OrderList.Page'
        :handlePageChange='handlePageChange'
        :count='DataNumber'
        :pageSize='condition4OrderList.PageSize'
        class="float"
       />
    </footer>
    <el-image-viewer
      :showViewer.sync='showViewer'
      :PreviewSrc="PreviewSrc"
    />
  </section>
</template>

<script>
import { imgUrl } from '@/assets/js/setup';
import { ConvertTimeFormat } from '@/assets/js/utils/ConvertTimeFormat';
import { mapState, mapActions } from 'vuex';
import ElImageViewer from '@/components/common/ImageViewer.vue';
import SingleSelector from '@/components/common/Selector/SingleSelector.vue';
import Count from '@/components/common/Count.vue';
// import SearchInputComp from '@/components/common/Selector/SearchInputComp.vue';
import AddCertificateDialog from '@/components/common/AddCertificateDialog';

export default {
  components: {
    Count,
    ElImageViewer,
    SingleSelector,
    // SearchInputComp,
    AddCertificateDialog,
  },
  data() {
    return {
      imgUrl,
      showViewer: false,
      PreviewSrc: null,
      editItem: null,
      isLoadding: false,
      CertificateList: [],
      CertificateStatus: [
        { label: '不限', value: '' },
        { label: '已过期', value: 0 },
        { label: '有效', value: 1 },
      ],
      condition4OrderList: {
        CertificateType: '',
        CertificateStatus: '',
        CheckStatus: '',
        ID: '',
        FieldType: '',
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      },
      DataNumber: 0,
      addCertificateVisible: false,
    };
  },
  computed: {
    ...mapState('common', ['CertificateType']),
    CertificateTypeData: {
      get() {
        return this.condition4OrderList.CertificateType;
      },
      set(val) {
        if (this.condition4OrderList.CertificateType === val) return;
        this.condition4OrderList.CertificateType = val;
        this.getCertificateList();
      },
    },
    CertificateStatusData: {
      get() {
        return this.condition4OrderList.CertificateStatus;
      },
      set(val) {
        if (this.condition4OrderList.CertificateStatus === val) return;
        this.condition4OrderList.CertificateStatus = val;
        this.getCertificateList();
      },
    },
    KeyWords: {
      get() {
        return this.condition4OrderList.KeyWords;
      },
      set(val) {
        if (this.condition4OrderList.KeyWords === val) return;
        this.condition4OrderList.KeyWords = val;
      },
    },
  },
  methods: {
    ...mapActions('Authentication', ['getAuthCompanyInfo']),
    getConvertTimeFormat(date) {
      return ConvertTimeFormat(new Date(date));
    },
    getCertificateList(page = 1) {
      if (this.condition4OrderList.Page !== page) {
        this.condition4OrderList.Page = page;
      }
      this.api.getCustomerCertificateList(this.condition4OrderList).then(res => {
        if (res.data.Status === 1000) {
          this.CertificateList = res.data.Data;
          this.DataNumber = res.data.DataNumber;
        }
      });
    },
    setCondition4OrderList([[key1, key2], value]) {
      if (key2) this.condition4OrderList[key1][key2] = value;
      else this.condition4OrderList[key1] = value;
    },
    clearCondition4OrderList() {
      this.condition4OrderList = {
        CertificateType: '',
        CertificateStatus: '',
        CheckStatus: '',
        ID: '',
        FieldType: '',
        Page: 1,
        KeyWords: '',
        PageSize: 20,
      };
    },
    addCertificateClick() {
      this.editItem = null;
      this.addCertificateVisible = true;
    },
    editClick(item) {
      this.editItem = item;
      this.addCertificateVisible = true;
    },
    deleteClick(item) {
      const successFunc = () => {
        this.api.getCustomerCertificateRemove(item.CertificateID).then(res => {
          if (res.data.Status === 1000) {
            console.log(res);
            this.getCertificateList();
          }
        });
      };
      this.messageBox.warnCancelBox({
        title: '删除确认',
        msg: `确定要删除[${item.CertificateName}]吗？`,
        successFunc,
      });
    },
    checkClick(list, url) {
      const tempList = list.map(it => imgUrl + it);
      const index = tempList.findIndex(it => it === url);
      this.PreviewSrc = [...tempList.slice(index), ...tempList.slice(0, index)];
      this.showViewer = true;
    },
    handlePageChange(page) {
      this.getCertificateList(page);
    },
  },
  mounted() {
    this.isLoadding = false;
    this.getCertificateList();
  },
};
</script>

<style lang='scss'>
@import "@/assets/css/var.scss";
.mp-pc-my-setting-certificate-page-wrap {
  .mp-common-comps-search-box {
    padding-top: 2px;
    text-align: right;
    font-size: 14px;
    display: inline-block;
    > span:first-of-type {
      font-weight: 600;
      display: inline-block;
      margin-right: 0px;
      user-select: none;
      color: #585858;
      line-height: 28px;
      min-width: 5em;
    }
    .el-input,input {
      height: 30px;
      line-height: 28px;
      width: 150px;
      border-radius: 4px 0 0 4px;
    }
    button {
      border: none;
      height: 30px;
      line-height: 28px;
      width: 60px;
      outline: none;
      font-size: 20px;
      font-weight: 600;
      padding: 0;
      vertical-align: top;
      color: #fff;
      user-select: none;
      cursor: pointer;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
    }
    > input {
      border-bottom-right-radius: 0;
      border-top-right-radius: 0;
    }
    > button.mp-search-box-btn > i {
      display: block;
      height: 20px;
      width: 100%;
    }
  }
  > .filtrates {
    display: flex;
    align-items: center;
    margin-top: 30px;
    margin-left: 33px;
    >section{
      margin-right: 40px;
    }
    .status{
      width: calc(196px - 2em);
    }
  }
  > .el-table{
    margin-top: 30px;
    margin-left: 33px;
    .el-image{
      width: 40px;
      height: 40px;
      cursor: pointer;
      & + .el-image{
        margin-left: 10px;
      }
    }
    p{
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  > footer {
    height: 55px;
    padding-top: 19px;
  }
}
</style>
