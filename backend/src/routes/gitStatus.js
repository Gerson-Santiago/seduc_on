// // src/routes/gitStatus.js
// import express from 'express'
// import { execSync } from 'child_process'

// const router = express.Router()

// router.get('/git-status', (req, res) => {
//   try {
//     const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()
//     const status = execSync('git status -sb').toString().trim()

//     let ahead = 0, behind = 0
//     const match = status.match(/\[ahead (\d+)(?:, behind (\d+))?\]|\[behind (\d+)\]/)
//     if (match) {
//       ahead = parseInt(match[1] || '0')
//       behind = parseInt(match[2] || match[3] || '0')
//     }

//     res.json({ branch, ahead, behind })
//   } catch (error) {
//     console.error('Erro ao obter status Git:', error)
//     res.status(500).json({ error: 'Erro ao obter status Git' })
//   }
// })

// export default router
