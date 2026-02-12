"use client";

import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-[#1C3D78] px-6 text-white">
          <div className="text-[18px] font-extrabold">Algo salió mal</div>
          <div className="text-[14px] text-white/80 text-center">
            Ocurrió un error inesperado.
          </div>
          <button
            type="button"
            className="mt-2 rounded-2xl bg-[#FFE45A] px-8 py-3 text-[16px] font-extrabold text-[#F3A12A] shadow-sm"
            onClick={() => window.location.reload()}
          >
            Recargar
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
