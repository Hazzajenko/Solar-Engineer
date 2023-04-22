import {
  Axis,
  CanvasEntity,
  EntityBounds,
  getDistanceBetweenTwoPoints,
  getEntityBounds,
  NearbyEntity,
} from '@design-app/feature-design-canvas'

export const findNearbyAxisBounds = (bounds: EntityBounds, entities: CanvasEntity[]) => {
  const { left, right, top, bottom } = bounds
  return entities.filter((entity) => {
    const {
      left: entityLeft,
      right: entityRight,
      top: entityTop,
      bottom: entityBottom,
    } = getEntityBounds(entity)
    return (
      (entityLeft >= left && entityLeft <= right) ||
      (entityRight >= left && entityRight <= right) ||
      (entityTop >= top && entityTop <= bottom) ||
      (entityBottom >= top && entityBottom <= bottom)
    )
  }) /*.map((entity) => {
   return {
   ...entity,

   bounds: getEntityBounds(entity),
   }
   })*/
  // return nearbyEntities
  // const nearbyBounds = nearbyEntities.map((entity) => entity.bounds)
  // return nearbyBounds
}

/*export type NearbyAxisEntity = CanvasEntity & {
 axis: Axis
 bounds: EntityBounds
 }*/
// NearbyEntity
export const findNearbyBoundOverlapOnBothAxis = (
  bounds: EntityBounds,
  entities: CanvasEntity[],
): NearbyEntity[] => {
  const { left, right, top, bottom } = bounds
  const entitiesWithBounds = entities.map((entity) => {
    return {
      ...entity,
      bounds: getEntityBounds(entity),
    }
  })
  return ['x', 'y']
    .map((axis) => {
      /*      const { left, right, top, bottom } = bounds*/
      /*      const entitiesWithBounds = entities.map((entity) => {
       return {
       ...entity,
       bounds: getEntityBounds(entity),
       }
       })*/
      const nearbyEntities = entitiesWithBounds.filter((entity) => {
        const {
          left: entityLeft,
          right: entityRight,
          top: entityTop,
          bottom: entityBottom,
        } = entity.bounds
        return (
          (axis === 'x' &&
            ((entityLeft >= left && entityLeft <= right) ||
              (entityRight >= left && entityRight <= right))) ||
          (axis === 'y' &&
            ((entityTop >= top && entityTop <= bottom) ||
              (entityBottom >= top && entityBottom <= bottom)))
        )
      })
      /*      const nearbyEntities = entities.filter((entity) => {
       const {
       left: entityLeft,
       right: entityRight,
       top: entityTop,
       bottom: entityBottom,
       } = getEntityBounds(entity)
       return (
       (axis === 'x' &&
       ((entityLeft >= left && entityLeft <= right) ||
       (entityRight >= left && entityRight <= right))) ||
       (axis === 'y' &&
       ((entityTop >= top && entityTop <= bottom) ||
       (entityBottom >= top && entityBottom <= bottom)))
       )
       })*/
      return nearbyEntities.map((entity) => {
        // const { left: entityLeft, right: entityRight, top: entityTop, bottom: entityBottom } = getEntityBounds(entity)
        // const distance = axis === 'x' ? Math.abs(entityLeft - left) : Math.abs(entityTop - top)
        const distance = getDistanceBetweenTwoPoints(
          { x: entity.bounds.left, y: entity.bounds.top },
          { x: left, y: top },
        )
        return {
          ...entity,
          axis: axis as Axis,
          bounds: getEntityBounds(entity),
          distance,
        }
      })
    })
    .reduce((accumulator, value) => accumulator.concat(value), [])
}
// a.reduce((accumulator, value) => accumulator.concat(value), []);

export const findNearbyAxisBoundsByAxis = (
  bounds: EntityBounds,
  entities: CanvasEntity[],
  axis: Axis,
) => {
  const { left, right, top, bottom } = bounds
  const nearbyEntities = entities.filter((entity) => {
    const {
      left: entityLeft,
      right: entityRight,
      top: entityTop,
      bottom: entityBottom,
    } = getEntityBounds(entity)
    return (
      (axis === 'x' &&
        ((entityLeft >= left && entityLeft <= right) ||
          (entityRight >= left && entityRight <= right))) ||
      (axis === 'y' &&
        ((entityTop >= top && entityTop <= bottom) ||
          (entityBottom >= top && entityBottom <= bottom)))
    )
  })
  return nearbyEntities.map((entity) => {
    // const { left: entityLeft, right: entityRight, top: entityTop, bottom: entityBottom } = getEntityBounds(entity)
    return {
      ...entity,
      axis,
      bounds: getEntityBounds(entity),
    }
  })
  /*  const nearbyBounds = nearbyEntities.map((entity) => {
   const { left: entityLeft, right: entityRight, top: entityTop, bottom: entityBottom } = getEntityBounds(entity)
   return {
   left: axis === 'x' ? entityLeft : left,
   right: axis === 'x' ? entityRight : right,
   top: axis === 'y' ? entityTop : top,
   bottom: axis === 'y' ? entityBottom : bottom,
   }
   })*/
  // return nearbyBounds
}