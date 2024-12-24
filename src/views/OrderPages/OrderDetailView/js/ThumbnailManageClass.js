import api from '../../../../api';

export const FileThumbnailStatusObj = {
  WaitGenerate: {
    ID: 0,
    Name: '等待生成', // 上面显示等待生成 --- 第二行不显示
  },
  HaveGenerated: {
    ID: 1,
    Name: '已生成', // 【调用接口】 显示两行图片
  },
  UnGenerate: {
    ID: 2,
    Name: '不生成', // 订单过期、取消、非自建审稿流程 --- 显示文字：不支持文件预览 -- 2个都不出现
  },
  HaveRemove: {
    ID: 3,
    Name: '过期已删除', // 系统保存一周内订单缩略图 --- 显示文字：预览文件已清除 -- 2个都不出现
  },
  NoFile: {
    ID: 4,
    Name: '无文件', // 整体不显示
  },
};

/*
  缩略图数据

  FileList：审稿前数据 - 数组 - 每个文件中  IsSupport 为true时才支持文件预览 此时如果所属列表为空 说明生成失败;  如果为false 显示不支持

  PicList： 审稿后数据长度为0 整行不显示
 */

const unGenerateImg = require('../assets/unGenerate.png');
const failImg = require('../assets/fail.png');
const bigFailImg = require('../assets/fail-big.png');
const unSupImg = require('../assets/unSupport.png');
const bigUnSupImg = require('../assets/unSupport-big.png');

export default class ThumbnailManageClass {
  hidden = false // 优先级1 整体隐藏

  placeholder = '' // 优先级2 显示文字说明

  beforeList = []

  afterList = []

  loading = false

  havePic = false

  async getThumbnailData(OrderID) {
    this.havePic = true;

    this.loading = true;
    const resp = await api.getOrderThumbnail(OrderID).catch(() => null);
    this.loading = false;

    if (resp && resp.data.Status === 1000 && resp.data.Data) {
      const { FileList, PicList } = resp.data.Data;

      (FileList || []).forEach(it => { // { FilePath: string; IsSupport: boolean; List: string[]; }
        if (it.IsSupport) {
          if (it.List && it.List.length > 0) {
            this.beforeList.push(...it.List.map(src => ({
              src, bigSrc: undefined, FilePath: it.FilePath, success: true,
            })));
          } else {
            this.beforeList.push({
              src: failImg,
              bigSrc: bigFailImg,
              FilePath: it.FilePath,
              success: false,
            });
          }
        } else {
          this.beforeList.push({
            src: unSupImg,
            bigSrc: bigUnSupImg,
            FilePath: it.FilePath,
            success: false,
          });
        }
      });

      this.afterList = (PicList || []).map(src => ({
        src, bigSrc: undefined, FilePath: undefined, success: true,
      }));
    } else {
      this.placeholder = '预览图片获取失败';
    }
  }

  constructor(OrderDetail) {
    switch (OrderDetail.ThumbnailStatus) {
      case FileThumbnailStatusObj.WaitGenerate.ID:
        // 显示 尚未生成 占位图片
        this.beforeList = [
          {
            src: unGenerateImg,
            bigSrc: undefined,
            FilePath: undefined,
            success: false,
          },
        ];
        break;

      case FileThumbnailStatusObj.HaveGenerated.ID:
        this.getThumbnailData(OrderDetail.OrderID);
        break;

      case FileThumbnailStatusObj.UnGenerate.ID:
        this.placeholder = '不支持文件预览';
        break;

      case FileThumbnailStatusObj.HaveRemove.ID:
        this.placeholder = '预览文件已清除';
        break;

      case FileThumbnailStatusObj.NoFile.ID:
        this.hidden = true;
        break;

      default:
        break;
    }
  }
}
