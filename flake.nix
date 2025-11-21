{
  description = "MCP calc tools server";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs { inherit system; };
    app = pkgs.writeShellApplication {
      name = "mcp-calc-tools";
      runtimeInputs = [ pkgs.nodejs_22 pkgs.pnpm ];
      text = ''
        set -euo pipefail
        if [ ! -f index.js ]; then
          echo "index.js not found in current directory. Run this from the mcp-calc-tools checkout." >&2
          exit 1
        fi
        node index.js
      '';
    };
  in {
    apps.${system}.default = {
      type = "app";
      program = "${app}/bin/mcp-calc-tools";
    };

    devShells.${system}.default = pkgs.mkShell {
      packages = [ pkgs.nodejs_22 pkgs.pnpm ];
    };
  };
}
