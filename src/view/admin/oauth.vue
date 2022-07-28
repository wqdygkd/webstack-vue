<template>
  <div />
</template>

<script>
import { post } from '@/api'
export default {
  data () {
    return {}
  },
  async created () {
    const code = this.$route.query.code

    const token = await post(`http://localhost:3000/api/oauth-github?code=${code}`)

    console.log(token)
  }
}
</script>
