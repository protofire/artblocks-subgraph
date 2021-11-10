import { Bytes, ethereum } from "@graphprotocol/graph-ts"

export namespace tests {
	export namespace helpers {
		function getNewParam() {
			return new ethereum.EventParam()
		}
		export namespace params {

			export function getI32(value: i32) {
				let param = getNewParam()
				param.value = ethereum.Value.fromI32(value)
				return param
			}

			export function getString(value: string) {
				let param = getNewParam()
				param.value = ethereum.Value.fromString(value)
				return param
			}

			export function getBytes(value: Bytes) {
				let param = getNewParam()
				param.value = ethereum.Value.fromBytes(value)
				return param
			}

			export function getBoolean(value: boolean) {
				let param = getNewParam()
				param.value = ethereum.Value.fromBoolean(value)
				return param
			}

		}
	}
}