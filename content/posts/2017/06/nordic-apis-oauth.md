---
title: Nordic APIs OAuth Workshop, Amsterdam June 2017
slug: nordic-apis-oauth-workshop
date: 2017-06-12
author: Hugh Grigg
tech:
 - OAuth
 - OpenID
topics:
 - Amsterdam
 - Events
 - Learning
 - Nordic APIs
---

In June I attended [Nordic API's workshop](http://nordicapis.com/events/nordic-
apis-workshops-amsterdam/) on OAuth and OpenID in Amsterdam. Here are my notes
on the class.

## Actors in OAuth

 - **AS**: Authorisation Server (OAuth Server), e.g. bank auth server
 - **RS**: Resource Server, e.g. bank account server
 - **RO**: Resource Owner, e.g. bank customer
 - **C**: Client, e.g. mobile app

OAuth is designed for cross-organisational authorisation, i.e. where the client
is not trusted (which should always be the case). The AS and RO do not want to
let the client nor the resource server have access to the RO's credentials.

A client could be provided by a completely separate organisation, e.g. a third-
party Twitter app. The resource server should not be concerned with the details
of users, just performing their requested actions. In this way, OAuth is not an
authorisation protocol, but a delegation protocol.

## OAuth code flow

The standard and recommended oauth flow uses an [authentication
code](http://oauthlib.readthedocs.io/en/latest/oauth2/grants/authcode.html)
approach:

 1. RO asks client to do something.
 1. Client makes GET request to **authorisation endpoint** on AS, with the
    required scope (e.g. "read balance" or "transfer money").
 1. AS responds with a 3xx response to send client to authentication endpoint.
 1. After authentication, a one-time auth code (a **grant**) is given to the
    client.
 1. Client makes a POST request to the token endpoint with the grant and a
 	client secret.
 1. After checking grant and secret, AS responds with an **access token** (AT)
    and a **refresh token** (RT).
 1. Client makes the request for the original action to RS with this header:
    `Authorization: Bearer {AT}`.

## Example OAuth code flow requests and responses

Authorise:

```http
GET /oauth/v2/authorize?client_id=client-1&amp;scope=read&amp;response_type=code HTTP/1.1
Host: auth.example.com

...

HTTP/1.1 301 Moved Permanently
Location: https://app.other-example.com/callback?code=L8ZKjO2TTVbg1hghhM15EvvA23
```

Token:

```http
POST /oauth/v2/token HTTP/1.1
Host: auth.example.com
Content-Type: application/x-www-form-urlencoded

grant_type=authorization_code&client_id=client-1&client_secret=Password1
&code=L8ZKjO2TTVbg1hghhM15EvvA23

...

HTTP/1.1 200 OK

{
    "access_token": "b4ff0851-b0a1-4ea3-a04a-8b997bf83079",
    "scope": "",
    "token_type": "bearer",
    "expires_in": 300
}
```

Resource server call:


```http
GET /hello_world HTTP/1.1
Host: resource.example.com
Authorization: Bearer b4ff0851-b0a1-4ea3-a04a-8b997bf83079

...

HTTP/1.1 200 OK

<xml>Here's your sensitive data</xml>
```

## OpenID Connect

[OpenId Connect](http://oauthlib.readthedocs.io/en/latest/oauth2/oidc.html) is
built on top of OAuth and adds an identity layer.

In the initial request to the AS, the scope is set to `openid`. After
authentication, the AS providers an **id token** (IT) along with the AT and RT.

The IT is a JSON document with information about:

 - identity
 - authentication method
 - client it was issued for (audience)

The IT is a signed JWT. The client can use the public key of the AS to verify
it.

No information beyond identity should be stored in the JWT, as it is not there
to provide any extraneous data to the client. It should be for authorisatiom and
identification only.

## OAuth introspection

An endpoint on e.g. `/oauth/v2/introspect`. The client sends the access token
and client id and the AS responds with an identity document similar to a JWT but
unsigned, e.g.

```json
{
	"active": true,
	"scope": "read write email",
	"client_id": "foobar_id",
	"username": "joebloggs",
	"exp": 1497269423
}
```

This is used to check if the token the client has is valid, and what it is for.

## Refreshing OAuth tokens

Access tokens are usually short-lived, e.g. 30 seconds or 5 minutes. To avoid
repeatedly authenticating the user, we can use the refresh token.

The client calls the `/token` endpoint again, e.g.:

```http
POST /oauth/v2/token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&client_id=fooclient&client_secret=foosecret
&refresh_token=foobar123

...

HTTP/1.1 200 OK

{
	"access_token": "access123",
	"refresh_token": "refresh123",
	"token_type": "bearer",
	"expires_in": 300
}
```

Each refresh token can only be used once, and may only be used by the client
it was granted to.

## JWK: JSON Web Key

JWK is a [JSON format](https://self-issued.info/docs/draft-ietf-jose-json-web-
key.html) for sending cryptographic keys.

```json
{
	"kty":"EC",
	"crv":"P-256",
	"x":"f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
	"y":"x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
	"kid":"Public key used in JWS spec Appendix A.3 example"
}
```

## Implicit grant

An [implicit
flow](http://oauthlib.readthedocs.io/en/latest/oauth2/grants/implicit.html) is
used for an application that is unable to keep a secret. For example, a backend
server is a private client as it can securely store a secret, whilst a frontend
JavaScript application is a public client as it cannnot securely store the
secret.

Such a client can make a request to the `/authorise` endpoint, and gets back an
access token directly as part of the redirect URL, but no refresh token. The
access token is included in the fragment part of the URL, so that only the
client has access to it (the fragment is not sent to servers).

## Client-only flow

There is also a flow for [client-only authentication](http://oauthlib.readthedoc
s.io/en/latest/oauth2/grants/credentials.html), e.g. a cronjob process that acts
on its own and not on behalf of a resource owner (user).

Such a client can send a request to the `/token` endpoint, e.g.:

```http
POST /oauth/v2/token HTTP/1.1
Content-Type: application/x-www-form-urlencoded

grant_type=read&client_id=fooclient&client_secret=foosecret

...

HTTP/1.1 200 OK

{
	"access_token": "access123",
	"subject": "fooclient",
	"client_id": "fooclient",
	"token_type": "bearer",
	"expires_in": 300
}
```

Notice that the `subject` and `client_id` are the same in this response. No
refresh token is provided, as this kind of client can simply re-authenticate
whenever it needs to.

This flow should only be used by private, pre-trusted clients that are able to
securely store the access token.

## Resource owner credentials flow

This flow is for situations where the resource owner trusts the client (e.g.
their operating system, and not some third-party app). Because of this pre-
trust, this flow is not ideal and should only be used when other flows are not
possible.

The client collects the credentials from the resource owner and sends them to
the AS itself, with a grant_type of `password`. This is dangerous because the
client gets to see the credentials (vs only ever getting tokens in the standard
code-based flow above).

The AS then responds with an access token as usual. This way at least the
resource server does not see the RO credentials, only the client and AS.

## Exercises

[https://github.com/curityio/nordicapis-python-openid-connect-client](https://github.com/curityio/nordicapis-python-openid-connect-client)
[https://github.com/curityio/oauth-filter-for-python-flask](https://github.com/curityio/oauth-filter-for-python-flask)
