<template>
  <div>
    <p>Showing {{ changes.length }} changes:</p>
    <table>
      <thead>
        <tr>
          <th>Revision</th>
          <th>Author</th>
          <th>Description</th>
          <th>Files</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="change in changes" :key="change.id">
          <td key="revision">{{ change.revision }}</td>
          <td key="author">{{ change.author }}</td>
          <td key="comments">{{ change.comments }}</td>
          <td key="files">
            <ul>
              <li v-for="file in change.files" :key="file">{{ file }}</li>
            </ul>
            <span v-if="change.files.length == 0">None</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
module.exports = {}
</script>

<style scoped>
p {
  font-size: 2em;
  text-align: center;
}
</style>
