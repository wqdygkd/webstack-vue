<template>
  <ins
    class="adsbygoogle"
    style="display:block;width:100%;height:100%"
    data-ad-client="ca-pub-9068539038073295"
    data-ad-slot="9123470530"
    data-ad-format="fluid"
    data-ad-layout-key="-fb+5w+4e-db+86"
  />
</template>

<script>
export default {
  mounted () {
    this.adScript()
  },
  methods: {
    adScript () {
      if (!window.adsbygoogle) {
        const oScript = document.createElement('script')

        oScript.onload = function () {
          // eslint-disable-next-line no-undef
          (adsbygoogle = window.adsbygoogle || []).push({})
        }

        oScript.type = 'text/javascript'
        oScript.async = 'async'
        oScript.crossorigin = 'anonymous'
        oScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9068539038073295'
        this.$el.parentNode.appendChild(oScript)
      } else {
        // eslint-disable-next-line no-undef
        (adsbygoogle = window.adsbygoogle || []).push({})
      }
    }
  }
}
</script>

<style scoped>
</style>
