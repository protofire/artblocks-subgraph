# Artblocks
_Made by Protoire.io under MIT License_

"Art Blocks is a first of its kind platform focused on genuinely programmable on demand generative content that is stored immutably on the Ethereum Blockchain. You pick a style that you like, pay for the work, and a randomly generated version of the content is created by an algorithm and sent to your Ethereum account. The resulting piece might be a static image, 3D model, or an interactive experience. Each output is different and there are endless possibilities for the types of content that can be created on the platform."
 > https://www.artblocks.io/


This subgraph provide an standard erc-721 implementation, providing info about minting, transfer, bruning, approval. Additionally, this subgraph offers metadata about the transfers such as TransactionMeta and Block entities. The main feature of the Art Blocks platform is the collection grouping, this information is obtained trough the "Mint" event which allows this subgraph to relate Tokens and Collections

This subgraph rely's on this contract:
- Art Blocks BLOCKS Token: 0xa7d8d9ef8D8Ce8992Df33D8b8CF4Aebabd5bD270

## Transaction

	Transfer(indexed address,indexed address,indexed uint256)

This interface provides useful information about basic Ercc-721 operations. 

Please see the TransactionMeta entity to get info about the chain's transactions

Relates to a "from" account, a "to" account, a block and a token. 

The transaction interface provides additional support trough the following entities:

	Mint, Burn, Transfer

## Account

	Approval(indexed address,indexed address,indexed uint256)

This entity provides information about ethereum's external accounts which can hold and transfer tokens. This entity is related to the Mint, Transfer, Burn and Token entities.

In order to transfer a token, the account must be represented as "operator" or "owner" in the Token entity.

## OperatorOwner

	ApprovalForAll(indexed address,indexed address,bool)

In order to support "approval for all" Accounts are related as "many to many" using the OperatorOwner entity.

## Token

	Generated(indexed uint256,indexed address,string)

The Token entity provides an standard erc-721 token interface wich also holds the collection, an string representation of the nft's art.

## Collection

	Mint(indexed address,indexed uint256,indexed uint256)

The Collection entity groups a series of tokens minted in the same collection.

## Other entities

In order to provide additional info, the Block and TransactionMeta entities are added. The first one contains info about block number's and timestamp. The other one contains information about chain's transacion such as hash, gasUsed, etc.

## Example Queries


```graphql
# working with Transactions
{
   Transactions
	   id
	   type
	   ...on Mint{
		   to {
			   address
		   }
	   }
	   ...on Burn{
		   form {
			   address
		   }
	   }
	   ...on Transfer{
		   from{
			   address
		   }
		   to{
			   address
		   }
	   }
   }
}
```


```graphql
# working with accounts
{
   accounts{
	   sent{
		   token {
			   collection
		   }
	   }
	   recieved {
		   block {
			   number
		   }
	   }
	   approved {
		   token {
			   id
		   }
	   }
   }	  
}
```


```graphql
# working with Tokens
{
   tokens{
	   owner {
		   address
	   }
	   burned
	   collection
   }
}
```

```graphql
# working Collections
{
	collections (where: {id: "0xEXAMPLE"} ){
		tokens{
			owner {
				address
			}
			burned
		}
	}
}
```