# Integration Examples

This document provides examples of how to use the integration tools with Claude.

## Basic Integration

```
Calculate the integral of x^2 from 0 to 1
```

Expected result: 1/3 (0.333...)

## Riemann Integration

```
Calculate the integral of sin(x) from 0 to π using the midpoint Riemann method with 100 partitions
```

Expected result: 2.0 (with small numerical error)

## Darboux Integration

```
Calculate the Darboux integral of x^3 from 0 to 1 with 50 partitions
```

This will return both upper and lower bounds.

## Riemann-Stieltjes Integration

```
Calculate the Riemann-Stieltjes integral of x^2 with respect to the integrator x^3 from 0 to 1 using 100 partitions
```

## Lebesgue Integration

```
Calculate the Lebesgue integral of 1/(1+x^2) from -5 to 5 with 50 partitions
```

## Ito Stochastic Integration

```
Calculate the Ito integral of x with respect to a Brownian motion from 0 to 1 with drift 0.05 and volatility 0.2, using 1000 simulations and 100 steps
```

## Complex Example

```
Calculate the integral of sin(x^2) from 0 to 2 using the trapezoid Riemann method with 200 partitions
```

This is a challenging integral that doesn't have an elementary antiderivative, making numerical methods particularly useful.
