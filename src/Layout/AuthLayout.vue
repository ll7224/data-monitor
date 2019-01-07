<template>
  <Row class="container">
    <Col :span="6" class="horizontal-section navigator-section">
      <slot name="navigator"/>
    </Col>
    <Col :span="18" class="horizontal-section">
      <slot/>
    </Col>
  </Row>  
</template>

<style lang="stylus" scoped>
 @import "../assets/styles/varibles";
 .horizontal-section
   height: $horizontal-section-height
 .navigator-section
   background-color: #f9fbfd
</style>
