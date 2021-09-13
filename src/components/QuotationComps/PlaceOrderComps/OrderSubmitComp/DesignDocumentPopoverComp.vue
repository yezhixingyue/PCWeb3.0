<template>
  <el-popover placement="top-start" width="564" offset="108" trigger="click">
    <section class="mp-file-upload-tips-popover-wrap">
      <header><i></i>文档设计标准</header>
      <ul>
        <li>
          <p>1．软件版本</p>
          <span>CDR文件推荐使用X4（如有高版本文件建议转PDF或JPG进行上传）</span>
        </li>
        <li>
          <p>2．字体与转曲</p>
          <span>文档需提前进行转曲（栅格化）</span>
        </li>
        <li>
          <p>3．尺寸出血与边距</p>
          <span>下单尺寸要与文件成品尺寸保持一致；</span>
          <span>重要图文信息距边距3mm及以上，出血勿携带裁切脚线</span>
        </li>
        <li>
          <p>4．分辨率</p>
          <span>按照印刷最小分辨率要求不小于300dpi</span>
        </li>
        <li>
          <p>5．特殊效果</p>
          <span>特殊效果建议转位图处理</span>
        </li>
        <li>
          <p>6．最小字号及极细线</p>
          <span>印刷最小字号为5pt，烫金最小字号为7pt；</span>
          <span>印刷线条最细为0.076mm，烫金最细线条为0.2mm</span>
        </li>
        <li>
          <p>7．颜色设置</p>
          <span>印刷文档要求颜色模式为CMYK；</span>
          <span>四色黑字及四色黑二维码请转成单黑；</span>
          <span
            >大面积实地四色黑（C100 M100 Y100 K100）建议使用C30 K100替代</span
          >
        </li>
      </ul>
    </section>
    <span
      slot="reference"
      style="
        margin: 4px 0;
        margin-right: 10px;
        color: #428dfa;
        cursor: pointer;
        display: inline-block;
        font-size: 12px;
        height: 22px;
        line-height: 22px;
      "
      >查看文档设计标准</span
    >
  </el-popover>
</template>

<script>
export default {};
</script>
<style lang='scss'>
</style>
