import {defineCliConfig} from 'sanity/cli'
import {projectId, dataset} from './env'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  // 部署后台地址：vanyoucargo.sanity.studio
  studioHost: 'vanyoucargo',
  deployment: {
    appId: 'xwowlcyvn63c4t5c3ztkvc76',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  }
})
