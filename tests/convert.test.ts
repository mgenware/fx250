import * as assert from 'assert';
import convert from '../dist/convert';
import * as ts from 'typescript';

it('Add a member to HTMLElementTagNameMap', async () => {
  const src = `import { html, customElement, property } from 'lit-element';
@customElement('my-element')
export class MyElement extends LitElement { }
declare global {
        interface HTMLElementTagNameMap {
        "foo-bar": FooBar;
    }
}`;

  const res = convert(src, ts.ScriptTarget.ES2015);
  assert.equal(
    res,
    `import { html, customElement, property } from 'lit-element';
@customElement('my-element')
export class MyElement extends LitElement {
}
declare global {
    interface HTMLElementTagNameMap {
        "foo-bar": FooBar;
        "my-element": MyElement;
    }
}
`,
  );
});

it('Add HTMLElementTagNameMap', async () => {
  const src = `import { html, customElement, property } from 'lit-element';
@customElement('my-element')
export class MyElement extends LitElement { }
declare global {
    interface MyInterface {
        a?: int;
    }
}`;

  const res = convert(src, ts.ScriptTarget.ES2015);
  assert.equal(
    res,
    `import { html, customElement, property } from 'lit-element';
@customElement('my-element')
export class MyElement extends LitElement {
}
declare global {
    interface MyInterface {
        a?: int;
    }
    interface HTMLElementTagNameMap {
        "my-element": MyElement;
    }
}
`,
  );
});

it('Add global module', async () => {
  const src = `import { html, customElement, property } from 'lit-element';
@customElement('my-element')
export class MyElement extends LitElement { }
const i = 123;
@customElement('my-element2')
export class MyElement2 extends BaseElement { }
`;

  const res = convert(src, ts.ScriptTarget.ES2015);
  assert.equal(
    res,
    `import { html, customElement, property } from 'lit-element';
@customElement('my-element')
export class MyElement extends LitElement {
}
const i = 123;
@customElement('my-element2')
export class MyElement2 extends BaseElement {
}
declare global {
    interface HTMLElementTagNameMap {
        "my-element": MyElement;
        "my-element2": MyElement2;
    }
}
`,
  );
});

it('Tags defined', async () => {
  const src = `import { html, customElement, property } from 'lit-element';
@customElement('my-element')
export class MyElement extends LitElement {
//comment
}
declare global {
    interface HTMLElementTagNameMap {
        'my-element': MyElement;
        "foo-bar": FooBar;
    }
}`;

  const res = convert(src, ts.ScriptTarget.ES2015);
  assert.equal(res, null);
});

it('No custom element', async () => {
  const src = `import { html, customElement, property } from 'lit-element';
export class MyElement extends LitElement {
//comment
}
declare global {
    interface HTMLElementTagNameMap {
        "foo-bar": FooBar;
    }
}`;

  const res = convert(src, ts.ScriptTarget.ES2015);
  assert.equal(res, null);
});
