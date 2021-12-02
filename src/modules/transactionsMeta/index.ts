import { BigInt, Bytes } from "@graphprotocol/graph-ts";
import { TransactionMeta } from "../../../generated/schema";


export namespace transactionsMeta {
	export function getOrCreateTransactionMeta(
		id: string, blockId: string, hash: Bytes,
		from: Bytes, gasLimit: BigInt, gasPrice: BigInt
	): TransactionMeta {
		let meta = TransactionMeta.load(id)
		if (meta == null) {
			meta = new TransactionMeta(id)
			meta.block = blockId
			meta.hash = hash
			meta.from = from
			meta.gasLimit = gasLimit
			meta.gasPrice = gasPrice
		}
		return meta as TransactionMeta
	}

}