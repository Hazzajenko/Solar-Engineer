import { ClosedCircuitChain, OpenCircuitChain } from '@entities/shared'

export const isOpenCircuitChain = (
	chain: OpenCircuitChain | ClosedCircuitChain,
): chain is OpenCircuitChain => {
	return chain.__type === 'OpenCircuitChain'
}

// export const

export const isClosedCircuitChain = (
	chain: OpenCircuitChain | ClosedCircuitChain,
): chain is ClosedCircuitChain => {
	return chain.__type === 'ClosedCircuitChain'
}
