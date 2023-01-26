import { useWeb3React } from "@web3-react/core"
import { useEffect, useMemo, useState } from "react"
import { COINGECKO_LIST, fetchTokenList } from "../utils/lists"
import { useContractCallResult, useErc20Contract } from "./contract"
import ULTRACHESS_LIST from "../utils/lists/ultrachess.tokenlists.json"

export interface Token {
    address: string,
    chainId: number,
    name: string,
    symbol: string,
    decimals: number,
    logoUri?: string,
}

export function useTokenList() : Token[] {
    const { chainId } = useWeb3React()
    const [tokenList, setTokenList] = useState<Token[]>([])

    useEffect(() => {
        const callFetch = async () => {
            // const result = await fetchTokenList(
            //     ULTRACHESS_LIST,
            //     (ensName: string) => {
            //         return {} as Promise<string>
            //     }
            // )
            const _chainId = chainId ?? 31337
            console.log("chainId from token: ", _chainId)
            const tokens = ULTRACHESS_LIST.filter(token => token.chainId == _chainId)
            setTokenList(tokens)
        }

        callFetch()
            .catch(console.error)
    }, [chainId])

    return tokenList
}


export function useTokenFromList(address: string): Token {
    const tokenList = useTokenList()

    return useMemo(() => {
        try{
            return tokenList.find((val) => val.address == address)
        }
        catch(e){
            return {
                name: "blank",
                address: "blank",
                symbol: "blank",
                chainId: 0,
                decimals: 0
            }
        }
    }, [tokenList, address])
}

export function useTokenFromNetwork(address: string | null | undefined) : Token | null | undefined {
    const { chainId } = useWeb3React()

    const contract = useErc20Contract(address)
    const name = useContractCallResult(contract, "name")
    const symbol = useContractCallResult(contract, "symbol")
    const decimals = useContractCallResult(contract, "decimals")

    return useMemo(()=>{
        return {
            address,
            chainId,
            name,
            symbol,
            decimals
        } as Token
    }, [
        address,
        chainId,
        name,
        symbol,
        decimals
    ])
}

export function useToken(address?: string | null): Token | null | undefined {
    //const tokens = useTokenList()
    
    //const tokenFromList = useTokenFromList(tokens, address)
    const tokenFromNetwork = useTokenFromNetwork(address)

    return tokenFromNetwork
}