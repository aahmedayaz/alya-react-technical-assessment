type ProductErrorStateProps = {
  onRetry: () => void
}

export function ProductErrorState({ onRetry }: ProductErrorStateProps) {
  void onRetry
  return null
}
