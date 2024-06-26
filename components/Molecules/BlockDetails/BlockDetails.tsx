//@ts-nocheck
import { Address } from "@/components/Atoms";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { GRK_SIZES } from "@/utils/constants/shared.constants";
import { timestampParser } from "@/utils/functions";
import { None, Some, type Option } from "@/utils/option";
import { useGoldRush } from "@/utils/store";
import { type BlockDetailsProps } from "@/utils/types/molecules.types";
import { type Block } from "@covalenthq/client-sdk";
import { useEffect, useState } from "react";

export const BlockDetails: React.FC<BlockDetailsProps> = ({
    chain_name,
    height,
}) => {
    const { covalentClient } = useGoldRush();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [maybeResult, setResult] = useState<Option<Block>>(None);

    useEffect(() => {
        (async () => {
            setResult(None);
            setErrorMessage(null);
            try {
                const { data, ...error } =
                    await covalentClient.BaseService.getBlock(
                        chain_name,
                        height.toString()
                    );
                if (error.error) {
                    setErrorMessage(error.error_message);
                    throw error;
                }
                setResult(new Some(data.items[0]));
            } catch (error) {
                console.error(error);
            }
        })();
    }, [chain_name, height]);

    return (
        <>
            <Card className="flex w-full flex-col items-start gap-x-4 rounded border p-2 dark:bg-background-dark dark:text-white">
                <CardTitle className="">Overview</CardTitle>
                {maybeResult.match({
                    None: () => (
                        <div className="mt-4">
                            <Skeleton size={GRK_SIZES.LARGE} />
                        </div>
                    ),
                    Some: (block) =>
                        errorMessage ? (
                            <p className="mt-4">{errorMessage}</p>
                        ) : (
                            <div className="mt-2 grid w-full grid-cols-3 gap-16 gap-y-4">
                                <div>
                                    <CardDescription>HEIGHT</CardDescription>

                                    <p className="mt-1 flex items-center gap-x-1.5">
                                        {block.height.toLocaleString()}
                                    </p>
                                </div>

                                <div>
                                    <CardDescription>SIGNED AT</CardDescription>

                                    <div className="flex items-center gap-x-2">
                                        <p>
                                            {timestampParser(
                                                block.signed_at,
                                                "descriptive"
                                            )}
                                        </p>
                                    </div>
                                </div>

                                <div>
                                    <CardDescription>
                                        BLOCK HASH
                                    </CardDescription>

                                    <div className="flex items-center gap-x-2">
                                        
                                        <Address 
                                             // @ts-ignore
                                            address={block.block_hash} 
                                        />
                                    </div>
                                </div>

                                <div>
                                    <CardDescription>GAS USED</CardDescription>

                                    {block && <div className="flex items-center gap-x-2">
                                        
                                        {block.gas_used}{" "}
                                        <CardDescription>
                                            {(
                                                 // @ts-ignore
                                                (block.gas_used /
                                                 // @ts-ignore
                                                    block.gas_limit) *
                                                100
                                            ).toFixed(2)}
                                            %
                                        </CardDescription>
                                    </div>}
                                </div>

                                <div>
                                    <CardDescription>GAS LIMIT</CardDescription>

                                    <div className="flex items-center gap-x-2">
                                        
                                        {block.gas_limit.toLocaleString()}
                                    </div>
                                </div>

                                <div>
                                    <CardDescription>
                                        MINER ADDRESS
                                    </CardDescription>

                                    <div className="flex items-center gap-x-2">
                                        <Address
                                             // @ts-ignore
                                            address={block.miner_address}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <CardDescription>
                                        BLOCK PARENT HASH
                                    </CardDescription>

                                    <div className="flex items-center gap-x-2">
                                        <Address
                                             // @ts-ignore
                                            address={block.block_parent_hash}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <CardDescription>
                                        EXTRA DATA
                                    </CardDescription>

                                    <div className="flex items-center gap-x-2">
                                        {block.extra_data}
                                    </div>
                                </div>
                            </div>
                        ),
                })}
            </Card>
        </>
    );
};
