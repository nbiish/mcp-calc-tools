# Critical Repository Standards

This document outlines the mandatory standards and configurations for this repository. All automated agents and contributors must adhere to these instructions.

## 1. Core Documentation Synchronization

Ensure the following core files are synchronized with the `license-for-all-works` repository. Run these commands to update:

```bash
# License
curl -fLo LICENSE https://raw.githubusercontent.com/nbiish/license-for-all-works/refs/heads/main/working-LICENSE

# Contributing Guidelines
curl -fLo CONTRIBUTING.md https://raw.githubusercontent.com/nbiish/license-for-all-works/refs/heads/main/CONTRIBUTING.md

# Terms of Service
curl -fLo Terms-of-Service.md https://raw.githubusercontent.com/nbiish/license-for-all-works/refs/heads/main/Terms-of-Service.md

# Privacy Policy
curl -fLo Privacy-Policy.md https://raw.githubusercontent.com/nbiish/license-for-all-works/refs/heads/main/Privacy-Policy.md

# Critical Standards (Self-update)
curl -fLo critical.md https://raw.githubusercontent.com/nbiish/license-for-all-works/refs/heads/main/critical.md
```

## 2. Citation Requirement

In `README.md`, include the following BibTeX citation. Replace `<|repo_title|>` with the actual repository name.

```bibtex
@misc{<|repo_title|><|2025|>,
  author/creator/steward = {ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band and enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians},
  title/description = {<|repo_title|>},
  type_of_work = {Indigenous digital creation/software incorporating traditional knowledge and cultural expressions},
  year = {2025},
  publisher/source/event = {GitHub repository under tribal sovereignty protections},
  howpublished = {\url{https://github.com/nbiish/<|repo_title|>}},
  note = {Authored and stewarded by ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band and enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians. This work embodies Indigenous intellectual property, traditional knowledge systems (TK), traditional cultural expressions (TCEs), and associated data protected under tribal law, federal Indian law, treaty rights, Indigenous Data Sovereignty principles, and international indigenous rights frameworks including UNDRIP. All usage, benefit-sharing, and data governance are governed by the COMPREHENSIVE RESTRICTED USE LICENSE FOR INDIGENOUS CREATIONS WITH TRIBAL SOVEREIGNTY, DATA SOVEREIGNTY, AND WEALTH RECLAMATION PROTECTIONS.}
}
```

## 3. Support & Donation Section

Add the following support section to the top of `README.md`.

First, download the donation assets:
```bash
# Stripe QR Code
curl -fLo qr-stripe-donation.png https://raw.githubusercontent.com/nbiish/license-for-all-works/8e9b73b269add9161dc04bbdd79f818c40fca14e/qr-stripe-donation.png

# Buy Me a Coffee Button
curl -fLo buy-me-a-coffee.svg "https://img.buymeacoffee.com/button-api/?text=Buy%20me%20a%20coffee&emoji=&slug=nbiish&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"
```

Then, embed this HTML:
```html
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
```

## 4. GitHub Funding Configuration

Ensure `.github/FUNDING.yml` exists with the following content to enable the "Sponsor" button:

```yaml
# GitHub Sponsors and funding platforms for Nbiish's repositories
# This file enables the "Sponsor" button on GitHub repositories

github: [nbiish]  # GitHub Sponsors username
ko_fi: nbiish     # Ko-fi username
custom: [
  "https://raw.githubusercontent.com/nbiish/license-for-all-works/8e9b73b269add9161dc04bbdd79f818c40fca14e/qr-stripe-donation.png",
  "https://www.buymeacoffee.com/nbiish"
]
```

## 5. Copyright Notice

Use the following copyright notice where appropriate:

```markdown
Copyright © 2025 ᓂᐲᔥ ᐙᐸᓂᒥᑮ-ᑭᓇᐙᐸᑭᓯ (Nbiish Waabanimikii-Kinawaabakizi), also known legally as JUSTIN PAUL KENWABIKISE, professionally documented as Nbiish-Justin Paul Kenwabikise, Anishinaabek Dodem (Anishinaabe Clan): Animikii (Thunder), a descendant of Chief ᑭᓇᐙᐸᑭᓯ (Kinwaabakizi) of the Beaver Island Band, and an enrolled member of the sovereign Grand Traverse Band of Ottawa and Chippewa Indians. This work embodies Traditional Knowledge and Traditional Cultural Expressions. All rights reserved.
```
