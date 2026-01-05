'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Building2 } from 'lucide-react'

interface Contract {
  id: string
  name: string
  contractNumber: string
}

interface ContractSelectorProps {
  contracts: Contract[]
  currentContractId?: string
}

export function ContractSelector({ contracts, currentContractId }: ContractSelectorProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleContractChange = (contractId: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (contractId === 'all') {
      params.delete('contract')
    } else {
      params.set('contract', contractId)
    }
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex items-center gap-2">
      <Building2 className="h-4 w-4 text-gray-500" />
      <select
        value={currentContractId || 'all'}
        onChange={(e) => handleContractChange(e.target.value)}
        className="text-sm border border-gray-300 rounded-md px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <option value="all">All Contracts</option>
        {contracts.map((contract) => (
          <option key={contract.id} value={contract.id}>
            {contract.name} ({contract.contractNumber})
          </option>
        ))}
      </select>
    </div>
  )
}
