<template>
  <div class="mp-liscense-path-photo-img-upload-com">
    <p class="blue-v-line is-bold is-black">营业执照照片</p>
    <div class="img-box">
      <div class="pic is-font-18" :class="value?'':'show-bg'">
        <input type="file" class="upload" @change="onChange" accept='.png,.jpeg,.jpg,.bmp'>
        <div class="empty" v-if="!value">
          <div class="remark">
            <p class="remoark-text1">照片支持 .png, .jpg,.bmp 格式；</p>
            <p>请上传完整清晰的营业执照图片</p>
          </div>
        </div>
        <el-image v-else fit='contain' :src="value" class="liscense-upload-img" :preview-src-list="srcList">
        </el-image>
        <div class="liscense-img-mask" @click="onImgClick"></div>
      </div>
      <div class="text gray">
        <p class="is-bold">操作说明：</p>
        <p class="is-font-12">单击营业执照可查看图片；双击营业执照更换图片。<template v-if="!AllowEdit">（ 本月暂不可双击更改 ）</template></p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  model: {
    event: 'change',
    prop: 'value',
  },
  props: {
    value: {
      type: String,
      default: '',
    },
    AllowEdit: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      firstClickTime: '',
      secondClickTime: '',
      timer: null,
    };
  },
  computed: {
    srcList() {
      return this.value ? [this.value] : [];
    },
  },
  methods: {
    onChange(e) {
      const file = e.target.files[0];
      if (!file) {
        return;
      }
      if (
        file.type !== 'image/jpeg'
        && file.type !== 'image/png'
        && file.type !== 'image/bmp'
      ) {
        this.messageBox.warnSingleError({
          title: '图片格式错误',
          msg: '请上传 jpg/png/bmp 格式图片',
        });
        e.target.value = '';
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        this.messageBox.warnSingleError({
          title: '图片过大',
          msg: '请上传不超过4M大小的图片',
        });
        e.target.value = '';
        return;
      }
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file); // 根据图片路径读取图片
      fileReader.onload = (ie) => {
        const base64 = ie.currentTarget.result;
        const img = new Image();
        img.src = base64;
        img.onload = async () => {
          const imgInfo = {
            width: img.naturalWidth,
            height: img.naturalHeight,
          };
          if (imgInfo.width < 600 || imgInfo.height < 600) {
            this.messageBox.warnSingleError({
              title: '图片尺寸太小',
              msg: '请上传大于等于600×600像素的图片',
            });
            e.target.value = '';
            return;
          }
          const res = await this.api.uploadImage(file).catch(() => null);
          if (res && res.data.Status === 1000) {
            this.$emit('change', res.data.Data.Url);
          }
        };
      };
    },
    onImgClick() {
      if (!this.AllowEdit) {
        this.handleSingleClick();
        return;
      }
      this.firstClickTime = this.secondClickTime;
      this.secondClickTime = Date.now();
      if (!this.firstClickTime) {
        this.handleSingleClick();
        return;
      }
      if (this.secondClickTime - this.firstClickTime >= 300) {
        this.handleSingleClick();
      } else {
        clearTimeout(this.timer);
        this.timer = null;
        const oMask = document.querySelector('div.liscense-img-mask');
        const oInp = document.querySelector('input.upload');
        oMask.style.cursor = 'default';
        oInp.click();
      }
    },
    handleSingleClick() {
      const oImg = document.querySelector('div.liscense-upload-img.el-image > img');
      if (!oImg) return;
      const oMask = document.querySelector('div.liscense-img-mask');
      oMask.style.cursor = 'progress';
      this.timer = setTimeout(() => {
        oImg.click();
        this.timer = null;
        oMask.style.cursor = 'default';
      }, 300);
    },
  },
};
</script>
<style lang='scss'>
.mp-liscense-path-photo-img-upload-com {
  margin-top: 40px;
  > .img-box {
    margin-top: 32px;
    > div {
      // display: inline-block;
      &.pic {
        width: 360px;
        height: 360px;
        overflow: hidden;
        text-align: center;
        // padding-top: 175px;
        user-select: none;
        position: relative;
        &.show-bg {
          background: url(../../assets/images/license-empty.jpg) no-repeat center/100% 100%;
        }
        color: #aaa;
        > .el-image {
          width: 100%;
          height: 100%;
        }
        > span {
          position: absolute;
          top: 175px;
          left: 96px;
        }
        > input.upload {
          opacity: 0;
          width: 1px;
          height: 1px;
          position: absolute;
        }
        > .liscense-img-mask {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 9;
        }
        > .liscense-upload-img {
          background-color: rgba($color: #000000, $alpha: 0.4);
        }
        > div.empty {
          width: 100%;
          height: 100%;
          > .remark {
            width: 100%;
            height: 60px;
            position: absolute;
            left: 0;
            bottom: 0;
            font-size: 14px;
            background-color: rgba($color: #428dfa, $alpha: 0.5);
            color: #fff;
            > p.remoark-text1 {
              margin: 12px 0;
              margin-left: 12px;
            }
          }
        }
      }
      &.text {
        line-height: 20px;
        padding-left: 4px;
        padding-top: 10px;
        vertical-align: bottom;
        &.cancel {
          color: #aaa !important;
        }
        > p {
          // display: inline-block;
          letter-spacing: 1px;
          width: 360px;
        }
      }
    }
  }
}
</style>
