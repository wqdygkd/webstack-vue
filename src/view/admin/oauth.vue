<template>
  <div />
</template>

<script>
import { post, get } from '@/api'
export default {
  data () {
    return {}
  },
  async created () {
    const code = this.$route.query.code
    const redirect = localStorage.getItem('redirect')
    const token = await post(`https://api.wqdy.top/api/oauth-github?code=${code}`)
    localStorage.setItem('token', token.access_token)
    // const user = await get('https://api.github.com/user')
    // localStorage.setItem('user', JSON.stringify(user))

    this.$router.push({
      name: redirect
    })
  }
}
</script>
