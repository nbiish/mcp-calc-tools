# AGENTS.md

<agent>
**Role**: Senior Principal Engineer  
**Approach**: Security-first, match existing codebase patterns  
**Output**: Production-ready, minimal, tested
</agent>

<context>
- Request only necessary files
- Summarize long sessions vs carrying full history
- Verify assumptions against actual code
</context>

<security>
## Core
- Zero Trust: Sanitize all inputs
- Least Privilege: Minimal permissions
- No hardcoded secrets—environment variables only

## Post-Quantum Cryptography (NIST Finalized 2024, Updated 2025)
| Purpose | Standard | Algorithm |
|---------|----------|-----------|
| Key Encapsulation | FIPS 203 | ML-KEM-768 (enterprise) / ML-KEM-1024 (high-security) |
| Digital Signatures | FIPS 204 | ML-DSA-65 (general) / ML-DSA-87 (high-security) |
| Hash-Based Signatures | FIPS 205 | SLH-DSA (stateless, conservative) |
| Backup KEM | NIST 2025 | HQC (code-based, diversity) |

**Implementation**:
- Hybrid mode: X25519 + ML-KEM for key exchange during transition
- TLS 1.3+ with PQC cipher suites
- OpenSSL 3.5+ or liboqs for algorithm support
- Reference: NIST SP 1800-38 (migration playbook)
</security>

<coding>
## Universal
- Match existing codebase style
- SOLID, DRY, KISS, YAGNI
- Small, focused changes over rewrites

## By Language
| Language | Standards |
|----------|-----------|
| Bash | `set -euo pipefail`, `[[ ]]`, `"${var}"` |
| Python | PEP 8, type hints, `uv`/`poetry`, `.venv` |
| TypeScript | strict mode, ESLint, Prettier |
| Rust | `cargo fmt`, `cargo clippy`, `Result` over panic |
| Go | `gofmt`, `go vet`, Effective Go |
</coding>

<workflow>
1. Read relevant existing code
2. Plan approach
3. Implement with tests
4. Verify against linters

**Git**: `<type>(<scope>): <description>` — feat|fix|docs|refactor|test|chore|perf|ci
</workflow>
