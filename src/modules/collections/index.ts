import { Collection } from "../../../generated/schema"

export namespace collections {
	export function getOrCreateCollection(id: string): Collection {
		let entity = Collection.load(id)
		if (entity == null) {
			entity = new Collection(id)
		}
		return entity as Collection
	}
}