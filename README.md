# MCP Calc Tools

<div align="center">
  <hr width="50%">
  <h3>Support This Project</h3>
  <table style="border: none; border-collapse: collapse;">
    <tr style="border: none;">
      <td align="center" style="border: none; vertical-align: middle; padding: 20px;">
        <h4>Stripe</h4>
        <img src="qr-stripe-donation.png" alt="Scan to donate" width="180"/>
        <p><a href="https://raw.githubusercontent.com/nbiish/license-for-all-works/8e9b73b269add9161dc04bbdd79f818c40fca14e/qr-stripe-donation.png">Donate via Stripe</a></p>
      </td>
      <td align="center" style="border: none; vertical-align: middle; padding: 20px;">
        <a href="https://www.buymeacoffee.com/nbiish">
          <img src="buy-me-a-coffee.svg" alt="Buy me a coffee" />
        </a>
      </td>
    </tr>
  </table>
  <hr width="50%">
</div>

Advanced calculus, linear algebra, probability, and finance tools for AI agents, exposed via the Model Context Protocol (MCP).

## Features

- **Calculus**: Symbolic derivatives/integrals, numerical Riemann sums, limits, volumes of revolution.
- **Linear Algebra**: Matrix multiplication, inversion, determinants, eigenvalues.
- **Finance**: Black-Scholes pricing, Option Greeks, Sharpe Ratio, Value at Risk (VaR), Cashflow schedules.
- **Probability**: Normal, Binomial, and Poisson distributions.
- **Engineering**: Numerical Laplace and Fourier transforms.
- **Optimization**: Newton-method root finding.
- **Meta-Tools**: `describe_available_tools` for agent discovery.

## Installation

### For AI Agents (Claude Code, Cursor, Cline, Roo Code)

Add the following to your MCP configuration:

```json
{
  "mcpServers": {
    "calc-tools": {
      "command": "node",
      "args": ["/path/to/mcp-calc-tools/index.js"],
      "env": {}
    }
  }
}
```

## Usage Examples for Agents

### Calculus
- "Calculate the derivative of x^2 + sin(x)"
- "Find the area under x^3 from 0 to 2 using 1000 trapezoids"

### Finance
- "Price a European call option with S=100, K=105, T=0.5, r=0.03, sigma=0.2"
- "Generate a monthly cashflow schedule for a $10,000 loan at 5% interest for 1 year"

### Linear Algebra
- "Find the eigenvalues of the matrix [[1, 2], [3, 4]]"

## Security & Reliability

- **Safe Evaluation**: Uses `mathjs` for expression parsing, avoiding dangerous `eval()`.
- **Input Validation**: All parameters are strictly validated via Zod.
- **Safety Caps**: Numerical methods have hard caps on iterations and subintervals to prevent DoS.
- **CVE Fixes**: Dependencies updated to address known vulnerabilities (e.g., `qs`).

## Development

```bash
pnpm install
pnpm start
```

## Citation

```bibtex
@misc{mcp-calc-tools<|2025|>,
  author/creator/steward = {ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band and enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians},
  title/description = {mcp-calc-tools},
  type_of_work = {Indigenous digital creation/software incorporating traditional knowledge and cultural expressions},
  year = {2025},
  publisher/source/event = {GitHub repository under tribal sovereignty protections},
  howpublished = {\url{https://github.com/nbiish/mcp-calc-tools}},
  note = {Authored and stewarded by ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band and enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians. This work embodies Indigenous intellectual property, traditional knowledge systems (TK), traditional cultural expressions (TCEs), and associated data protected under tribal law, federal Indian law, treaty rights, Indigenous Data Sovereignty principles, and international indigenous rights frameworks including UNDRIP. All usage, benefit-sharing, and data governance are governed by the COMPREHENSIVE RESTRICTED USE LICENSE FOR INDIGENOUS CREATIONS WITH TRIBAL SOVEREIGNTY, DATA SOVEREIGNTY, AND WEALTH RECLAMATION PROTECTIONS.}
}
```

## License

Copyright © 2025 ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), a descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band, and an enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians. This work embodies Traditional Knowledge and Traditional Cultural Expressions. All rights reserved.
