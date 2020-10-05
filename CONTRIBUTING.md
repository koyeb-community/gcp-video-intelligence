# Contributing to Koyeb function catalog

**First:** if you're unsure or afraid of _anything_, just ask
or submit the issue or pull request anyways. You won't be yelled at for
giving your best effort. The worst that can happen is that you'll be
politely asked to change something. We appreciate any sort of contributions
and don't want a wall of rules to get in the way of that.

However, for those individuals who want a bit more guidance on the
best way to contribute to the project, read on. This document will cover
what we're looking for. By addressing all the points we're looking for,
it raises the chances we can quickly merge or address your contributions.

## Issues

### Reporting an Issue

* Make sure you test against the latest released version. It is possible
  we already fixed the bug you're experiencing.

* Provide a reproducible test case. If a contributor can't reproduce an issue, then it dramatically lowers the chances it'll get fixed. And in some cases, the issue will eventually be closed.

* Respond promptly to any questions made by the Koyeb team to your issue.
  Stale issues will be closed.

### Issue Lifecycle

1. The issue is reported.

2. The issue is verified and categorized by a Koyeb collaborator.
   Categorization is done via tags. For example, bugs are marked as "bugs"
   and easy fixes are marked as "easy".

3. Unless it is critical, the issue is left for a period of time (sometimes
   many weeks), giving outside contributors a chance to address the issue.

4. The issue is addressed in a pull request or commit. The issue will be
   referenced in the commit message so that the code that fixes it is clearly
   linked.

5. The issue is closed.

## Setting up Docker to work on Koyeb catalog function

If you have never worked with Docker before, you will have to complete the
following steps in order to be able to run Koyeb functions: https://docs.docker.com/get-docker/

### Opening a Pull Request

When you are ready to open a pull-request, you will need to [fork the Koyeb function](https://github.com/koyeb-community), push your changes to your fork, and then open a pull-request.

For example, my GitHub username is `bob` so I would do the following:

    git checkout -b my-feature
    // develop a patch
    git push https://github.com/bob/function-<name> my-feature

From there, open your fork in your browser to open a new pull-request.
