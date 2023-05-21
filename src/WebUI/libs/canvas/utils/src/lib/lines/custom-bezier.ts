const pi = Math.PI
// a zero coordinate, which is surprisingly useful
const ZERO = { x: 0, y: 0, z: 0 }

/**
 * Bezier curve constructor.
 *
 * ...docs pending...
 */
class Bezier2 {
	constructor(
		coords: Array<{
			x: number
			y: number
			z: number
		}>,
	) {
		let args = coords && coords.forEach ? coords : Array.from(arguments).slice()
		let coordlen = 0

		if (typeof args[0] === 'object') {
			coordlen = args.length
			const newargs = []
			args.forEach(function (point) {
				;['x', 'y', 'z'].forEach(function (d) {
					if (typeof point[d] !== 'undefined') {
						newargs.push(point[d])
					}
				})
			})
			args = newargs
		}

		let higher = false
		const len = args.length

		if (coordlen) {
			if (coordlen > 4) {
				if (arguments.length !== 1) {
					throw new Error('Only new Bezier(point[]) is accepted for 4th and higher order curves')
				}
				higher = true
			}
		} else {
			if (len !== 6 && len !== 8 && len !== 9 && len !== 12) {
				if (arguments.length !== 1) {
					throw new Error('Only new Bezier(point[]) is accepted for 4th and higher order curves')
				}
			}
		}

		const _3d = (this._3d =
			(!higher && (len === 9 || len === 12)) ||
			(coords && coords[0] && typeof coords[0].z !== 'undefined'))

		const points = (this.points = [])
		for (let idx = 0, step = _3d ? 3 : 2; idx < len; idx += step) {
			var point = {
				x: args[idx],
				y: args[idx + 1],
			}
			if (_3d) {
				point.z = args[idx + 2]
			}
			points.push(point)
		}
		const order = (this.order = points.length - 1)

		const dims = (this.dims = ['x', 'y'])
		if (_3d) dims.push('z')
		this.dimlen = dims.length

		// is this curve, practically speaking, a straight line?
		const aligned = utils.align(points, { p1: points[0], p2: points[order] })
		const baselength = utils.dist(points[0], points[order])
		this._linear = aligned.reduce((t, p) => t + abs(p.y), 0) < baselength / 50

		this._lut = []
		this._t1 = 0
		this._t2 = 1
		this.update()
	}
}
