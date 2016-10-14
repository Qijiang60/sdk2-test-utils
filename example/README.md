#Examples

The following examples are provided to help get started writing tests for your App SDK 2 based apps.

* [Getting Started](start) - Demonstrates the basics of writing unit tests for a simple app sub component.
* [Defect CRUD](crud) - Demonstrates writing tests for an app which performs a full Create/Read/Update/Delete lifecycle of a defect.
Includes mocking WSAPI ajax calls (both success and error conditions), the helper functions `pit` and `onceCalled`, and writing
jasmine expectations. 
* [Blocked Defects By IterationGrid](grid) - Demonstrates writing tests for an app which renders a grid of blocked defects.  Includes mocking WSAPI ajax calls,
working with custom context and timebox scope, the helper functions `pit` and `onceFired`, and writing jasmine expectations
