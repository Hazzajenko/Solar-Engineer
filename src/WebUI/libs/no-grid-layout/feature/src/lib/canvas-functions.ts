/*
 import { BlockRectModel } from '@grid-layout/data-access'

 export function drawLineForBelowBlock(blockRectModel: BlockRectModel) {
 if (this.cachedPanels) {
 const panelRects =  this.cachedPanels.filter(panel => panel.x !== blockRectModel.x)
 const panelRectsToCheck = panelRects.filter(rect => blockRectModel.x >= rect.x - rect.width / 2 && blockRectModel.x <= rect.x + rect.width / 2 && blockRectModel.y < rect.y)
 if (panelRectsToCheck.length) {
 const panelRectsToCheckWithDistance = panelRectsToCheck.map(rect => {
 const distance = Math.abs(rect.y - blockRectModel.y)
 return { ...rect, distance }
 })
 const panelRectsToCheckWithDistanceSorted = panelRectsToCheckWithDistance.sort((a, b) => a.distance - b.distance)
 const closestPanelRect = panelRectsToCheckWithDistanceSorted[0]
 if (closestPanelRect) {
 this.ctx.beginPath()
 this.ctx.moveTo(blockRectModel.x, blockRectModel.y + blockRectModel.height / 2)
 this.ctx.lineTo(blockRectModel.x, closestPanelRect.y - closestPanelRect.height / 2)
 this.ctx.stroke()

 const distanceToClosestPanel = closestPanelRect.y - closestPanelRect.height / 2 - (blockRectModel.y + blockRectModel.height / 2)
 this.ctx.fillStyle = 'red'
 this.ctx.font = '15px Arial'
 this.ctx.fillText(`${distanceToClosestPanel}px`, blockRectModel.x - 50, blockRectModel.y + blockRectModel.height / 2 + 50)
 }
 } else {
 this.ctx.beginPath()
 this.ctx.moveTo(blockRectModel.x, blockRectModel.y + blockRectModel.height / 2)
 this.ctx.lineTo(blockRectModel.x, this.canvas.height)
 this.ctx.stroke()

 const distanceToBottomOfPage = this.canvas.height - (blockRectModel.y + blockRectModel.height / 2)
 this.ctx.fillStyle = 'red'
 this.ctx.font = '15px Arial'
 this.ctx.fillText(`${distanceToBottomOfPage}px`, blockRectModel.x - 50, this.canvas.height - 50)
 }
 } else {
 this.ctx.beginPath()
 this.ctx.moveTo(blockRectModel.x, blockRectModel.y + blockRectModel.height / 2)
 this.ctx.lineTo(blockRectModel.x, this.canvas.height)
 this.ctx.stroke()

 const distanceToBottomOfPage = this.canvas.height - (blockRectModel.y + blockRectModel.height / 2)
 this.ctx.fillStyle = 'red'
 this.ctx.font = '15px Arial'
 this.ctx.fillText(`${distanceToBottomOfPage}px`, blockRectModel.x - 50, this.canvas.height - 50)
 }
 }*/
