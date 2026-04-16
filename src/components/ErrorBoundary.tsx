import { Component, type ErrorInfo, type ReactNode } from 'react';

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { error: null };
	}

	static getDerivedStateFromError(error: Error): State {
		return { error };
	}

	override componentDidCatch(error: Error, info: ErrorInfo): void {
		console.error('[Smokeless] React error boundary caught', error, info.componentStack);
	}

	override render(): ReactNode {
		if (this.state.error) {
			if (this.props.fallback !== undefined) {
				return this.props.fallback;
			}
			return (
				<div className="mx-auto flex h-dvh items-center px-4 py-10">
					<div className="w-full rounded-[20px] border border-red-400/20 bg-surface p-6">
						<div className="text-[1.1rem] font-medium text-text">Something went wrong</div>
						<p className="mt-2 break-words font-mono text-[11px] leading-relaxed text-text-dim">
							{this.state.error.message}
						</p>
					</div>
				</div>
			);
		}
		return this.props.children;
	}
}
