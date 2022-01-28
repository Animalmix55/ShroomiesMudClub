import React from 'react';
import { useContractContext } from '../contexts/ContractContext';

interface PresaleMintDetails {
    startDate: number;
    endDate: number;
}

interface PublicDetails {
    startDate: number;
    maxPerTransaction: number;
}

export function useMintDetails(
    sale?: 'presale' | 'public'
): PublicDetails | PresaleMintDetails;
export function useMintDetails(sale: 'public'): PublicDetails;
export function useMintDetails(sale: undefined): PublicDetails;
export function useMintDetails(): PublicDetails;
export function useMintDetails(sale: 'presale'): PresaleMintDetails;

export function useMintDetails(
    sale?: 'presale' | 'public'
): PresaleMintDetails | PublicDetails {
    const { tokenContract: contract } = useContractContext();
    const [details, setDetails] = React.useState<
        PresaleMintDetails & PublicDetails
    >({
        startDate: Infinity,
        endDate: Infinity,
        maxPerTransaction: 0,
    });

    React.useEffect(() => {
        if (!contract) return;

        if (sale === 'presale') {
            contract.methods
                .whitelistMint()
                .call()
                .then((fm) => {
                    const { startDate, endDate } = fm;
                    setDetails({
                        maxPerTransaction: 0,
                        startDate: Number(startDate),
                        endDate: Number(endDate),
                    });
                });

            return;
        }

        contract.methods
            .publicMint()
            .call()
            .then((fm) => {
                const { startDate, maxPerTransaction } = fm;
                setDetails({
                    startDate: Number(startDate),
                    maxPerTransaction: Number(maxPerTransaction),
                    endDate: 0,
                });
            });
    }, [contract, sale]);

    return details;
}

export default useMintDetails;
