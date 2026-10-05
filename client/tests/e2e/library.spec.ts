import { test, expect } from '@playwright/test'
import sharp from 'sharp'

test('staff dashboard has a fixed header, separate account pages and complete report sections', async ({
  page,
}) => {
  await page.goto('/login')
  await page.getByLabel('Email address').fill('admin@biblioteca.local')
  await page.getByLabel('Password', { exact: true }).fill('E2E-library-admin-password-2026')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page.getByRole('navigation', { name: 'Staff navigation' })).toBeVisible()
  await expect(page.locator('.sidebar .staff-profile')).toHaveCount(0)
  await expect(page.getByRole('link', { name: 'Member website' })).toHaveCount(0)
  await expect(page.locator('.workspace-header .profile-menu')).toBeVisible()
  await expect(page.locator('.workspace-header')).toHaveCSS('position', 'fixed')
  await expect(page.locator('.sidebar')).toHaveCSS('overflow-y', 'hidden')
  await expect(page.locator('.sidebar nav')).toHaveCSS('overflow-y', 'auto')
  const brandHeader = await page.locator('.sidebar-brand-header').boundingBox()
  const brand = await page.locator('.sidebar .brand').boundingBox()
  expect(brand!.y + brand!.height).toBeLessThan(brandHeader!.y + brandHeader!.height - 8)
  await expect(page.getByRole('heading', { name: 'Monthly borrowing', exact: true })).toBeVisible()
  const cards = await page.locator('.metrics-grid').boundingBox()
  const charts = await page.locator('.overview-charts').boundingBox()
  expect(charts!.y).toBeGreaterThan(cards!.y + cards!.height)
  await page.locator('.profile-menu summary').click()
  await page.getByRole('link', { name: 'My profile', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'My profile', exact: true })).toBeVisible()
  await expect(page.getByLabel('Full name', { exact: true })).toHaveCount(0)
  await page.getByRole('button', { name: 'Edit profile', exact: true }).click()
  await expect(page.locator('.profile-photo .avatar-large')).toHaveCSS('width', '104px')
  await expect(page.locator('.profile-camera')).toHaveCSS('position', 'absolute')
  await expect(page.getByLabel('Profile photo file')).toBeHidden()
  const photo = await sharp({
    create: { width: 40, height: 40, channels: 3, background: '#24634b' },
  })
    .png()
    .toBuffer()
  await page
    .getByLabel('Profile photo file')
    .setInputFiles({ name: 'profile.png', mimeType: 'image/png', buffer: photo })
  const cropDialog = page.getByRole('dialog', { name: 'Adjust your profile photo' })
  await expect(cropDialog).toBeVisible()
  await page.setViewportSize({ width: 390, height: 500 })
  expect(
    await cropDialog.evaluate((element) => element.scrollHeight <= element.clientHeight + 1),
  ).toBe(true)
  await expect(cropDialog.getByRole('button', { name: 'Save photo', exact: true })).toBeVisible()
  await page.setViewportSize({ width: 320, height: 720 })
  const cropBox = await cropDialog.getByRole('group', { name: 'Photo crop preview' }).boundingBox()
  expect(Math.abs(cropBox!.width - cropBox!.height)).toBeLessThan(2)
  await page.setViewportSize({ width: 1280, height: 720 })
  await cropDialog.getByLabel('Photo zoom').press('ArrowRight')
  await expect(cropDialog.getByLabel('Photo zoom')).toHaveValue('1.05')
  await cropDialog.getByRole('group', { name: 'Photo crop preview' }).press('ArrowRight')
  await cropDialog.getByRole('button', { name: 'Save photo', exact: true }).click()
  await expect(page.locator('.profile-menu .avatar img')).toBeVisible()
  await page.getByLabel('Full name', { exact: true }).fill('Library Administrator')
  await page.getByRole('button', { name: 'Save profile', exact: true }).click()
  await expect(page.getByText('Changes saved.', { exact: true })).toBeVisible()
  await page.getByRole('link', { name: 'Admins & staff', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Admins & staff', exact: true })).toBeVisible()
  await expect(
    page.getByRole('button', { name: 'Create staff account', exact: true }),
  ).toBeVisible()
  await page.getByRole('link', { name: 'Members', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Members', exact: true })).toBeVisible()
  await expect(page.getByRole('cell', { name: 'admin', exact: true })).toHaveCount(0)
  await page.getByRole('link', { name: 'Reports', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Monthly circulation', exact: true }),
  ).toBeVisible()
  await expect(
    page.getByRole('heading', { name: 'Most borrowed titles', exact: true }),
  ).toBeVisible()
  await expect(page.locator('.metrics-grid .metric svg')).toHaveCount(8)
  await expect(page.getByRole('button', { name: 'Print / Save PDF' })).toHaveCount(0)
  await expect(page.locator('.form-stack.export-fields')).toHaveCSS('display', 'grid')
  const filterRows = await page
    .locator('.export-fields > label')
    .evaluateAll(
      (labels) =>
        new Set(labels.map((label) => Math.round(label.getBoundingClientRect().top))).size,
    )
  expect(filterRows).toBe(2)
  const filters = await page.locator('.report-export-panel').boundingBox()
  const reportCards = await page.locator('.metrics-grid').boundingBox()
  expect(reportCards!.y - filters!.y - filters!.height).toBeGreaterThanOrEqual(24)
  await expect(
    page.locator('.sidebar-footer').getByRole('button', { name: 'Sign out' }),
  ).toBeVisible()
  await page.evaluate(() => window.scrollTo(0, 700))
  expect(
    await page
      .locator('.workspace-header')
      .evaluate((element) => element.getBoundingClientRect().top),
  ).toBe(0)
})

test('authentication fields are responsive, passwords toggle, and error toast closes inside its right edge', async ({
  page,
}) => {
  await page.goto('/register')
  const name = page.getByLabel('Full name')
  const email = page.getByLabel('Email address')
  const password = page.getByLabel('Password', { exact: true })
  const confirm = page.getByLabel('Confirm password', { exact: true })
  for (const width of [1280, 800, 390]) {
    await page.setViewportSize({ width, height: 900 })
    const boxes = await Promise.all(
      [name, email, password, confirm].map((field) => field.boundingBox()),
    )
    if (width >= 768) {
      expect(boxes[0]!.y).toBe(boxes[1]!.y)
      expect(boxes[2]!.y).toBe(boxes[3]!.y)
    } else {
      expect(boxes[1]!.y).toBeGreaterThan(boxes[0]!.y)
      expect(boxes[3]!.y).toBeGreaterThan(boxes[2]!.y)
    }
  }
  await name.fill('Test Reader')
  await email.fill('form-check@test.local')
  await password.fill('Form-check-password-2026')
  await confirm.fill('Different-password-2026')
  await page.getByRole('button', { name: 'Show password', exact: true }).first().click()
  await expect(password).toHaveAttribute('type', 'text')
  await page.getByRole('button', { name: 'Create account', exact: true }).click()
  await expect(page.getByText('Passwords do not match.', { exact: true })).toBeVisible()
  await page.goto('/login')
  await page.getByLabel('Email address').fill('missing-account@test.local')
  await page.getByLabel('Password', { exact: true }).fill('Wrong-password-2026')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  const toast = page.locator('[data-sonner-toast][data-type="error"]')
  await expect(toast).toBeVisible()
  await expect(toast).toHaveCSS('background-color', 'rgb(180, 35, 24)')
  const toastBox = (await toast.boundingBox())!
  const close = toast.getByRole('button', { name: /Close toast/i })
  const closeBox = (await close.boundingBox())!
  expect(closeBox.x).toBeGreaterThan(toastBox.x + toastBox.width / 2)
  expect(closeBox.x + closeBox.width).toBeLessThanOrEqual(toastBox.x + toastBox.width)
  await close.click()
  await expect(toast).toHaveCount(0)
})

test('reader can search, create an account, save a title, and reserve it', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /A place for your/ })).toBeVisible()
  await page.screenshot({ path: 'docs/previews/home-desktop.png', fullPage: true })
  await page.getByRole('textbox', { name: 'Search the library' }).fill('Achebe')
  await page.getByRole('button', { name: 'Find a book' }).click()
  await expect(page.getByRole('heading', { name: 'Things Fall Apart' })).toBeVisible()
  await page.getByRole('heading', { name: 'Things Fall Apart' }).getByRole('link').click()
  await page.getByRole('link', { name: 'Sign in to save or reserve' }).click()
  await page.getByRole('button', { name: 'Create an account' }).click()
  await page.getByRole('textbox', { name: 'Full name' }).fill('Amina Wanjiku')
  await page.getByRole('textbox', { name: 'Email address' }).fill(`reader-${Date.now()}@test.local`)
  await page.getByLabel('Password', { exact: true }).fill('A-reader-password-2026')
  await page.getByLabel('Confirm password', { exact: true }).fill('A-reader-password-2026')
  await page.getByRole('button', { name: 'Create account', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Welcome back, Amina' })).toBeVisible()
  await page.getByRole('link', { name: 'Catalog', exact: true }).first().click()
  await page.getByRole('textbox', { name: 'Search catalog' }).fill('Achebe')
  await page.getByRole('button', { name: 'Search', exact: true }).click()
  await page.getByRole('heading', { name: 'Things Fall Apart' }).getByRole('link').click()
  await page.getByRole('button', { name: 'Save for later' }).click()
  await expect(page.getByRole('button', { name: 'Remove from saved' })).toBeVisible()
  await page.getByRole('button', { name: 'Reserve this title' }).click()
  await expect(page.getByRole('button', { name: 'Reservation placed' })).toBeVisible()
  await page.getByRole('link', { name: 'My library', exact: true }).click()
  await page.getByRole('button', { name: 'Reservations', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Things Fall Apart' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: 'Welcome back, Amina' })).toBeVisible()
})

test('public pages remain usable on mobile and in dark mode', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  await expect(page.getByRole('heading', { name: /A place for your/ })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  await page.getByRole('button', { name: /Switch to .* mode/ }).click()
  await page.screenshot({ path: 'docs/previews/home-mobile-dark.png', fullPage: true })
  await page.getByRole('button', { name: 'Toggle navigation' }).click()
  const sidebar = page.getByRole('dialog', { name: 'Library navigation' })
  await expect(sidebar).toBeVisible()
  await expect(sidebar.getByRole('link', { name: 'Register', exact: true })).toBeVisible()
  await expect(sidebar.locator('nav .button')).toHaveCount(0)
  await page.keyboard.press('Escape')
  await expect(sidebar).toHaveCount(0)
  await expect(page.getByRole('button', { name: 'Toggle navigation' })).toBeFocused()
  await page.getByRole('button', { name: 'Toggle navigation' }).click()
  await sidebar.getByRole('link', { name: 'Catalog', exact: true }).click()
  await expect(sidebar).toHaveCount(0)
  await expect(page.getByRole('heading', { name: 'Find your next good read' })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})

test('staff can register a member, add inventory, and issue, renew, and return a copy', async ({
  page,
}) => {
  const unique = String(Date.now())
  const title = `Library workflow ${unique}`
  await page.goto('/login')
  await page.getByLabel('Email address').fill('admin@biblioteca.local')
  await page.getByLabel('Password', { exact: true }).fill('E2E-library-admin-password-2026')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page.getByRole('heading', { name: /Good to see you/ })).toBeVisible()
  await page.screenshot({ path: 'docs/previews/staff-dashboard.png', fullPage: true })

  await page.getByRole('link', { name: 'Books & copies', exact: true }).click()
  await page.getByRole('button', { name: 'Add title', exact: true }).click()
  const titleDialog = page.getByRole('dialog')
  await titleDialog.getByLabel('Title', { exact: true }).fill(title)
  await titleDialog.getByLabel('Author', { exact: true }).fill('Library Test Author')
  await titleDialog.getByLabel('ISBN / catalog identifier').fill(`TEST-${unique}`)
  await titleDialog.getByLabel('Genre', { exact: true }).fill('Fiction')
  await titleDialog.getByLabel('Publication year').fill('2025')
  await titleDialog.getByRole('button', { name: 'Add title', exact: true }).click()
  await expect(titleDialog).not.toBeVisible()
  const inventoryRow = page.getByRole('row').filter({ hasText: title })
  await inventoryRow.getByRole('button', { name: 'Copies', exact: true }).click()
  const copyDialog = page.getByRole('dialog')
  await copyDialog.getByLabel('Unique barcode').fill(`COPY-${unique}`)
  await copyDialog.getByLabel('Shelf location', { exact: true }).fill('TEST 1')
  await copyDialog.getByRole('button', { name: 'Add physical copy' }).click()
  await expect(page.getByText('Copy added to inventory.', { exact: true })).toBeVisible()
  await page.keyboard.press('Escape')
  await expect(copyDialog).not.toBeVisible()

  await page.getByRole('link', { name: 'Members', exact: true }).click()
  await page.getByRole('button', { name: 'Register member', exact: true }).click()
  const memberDialog = page.getByRole('dialog')
  await memberDialog.getByLabel('Full name').fill(`Reader ${unique}`)
  await memberDialog.getByLabel('Email address').fill(`staff-reader-${unique}@test.local`)
  await memberDialog.getByLabel('Initial password').fill('Member-testing-password-2026')
  await memberDialog
    .getByLabel('Confirm password', { exact: true })
    .fill('Member-testing-password-2026')
  await memberDialog.getByRole('button', { name: 'Register member', exact: true }).click()
  await expect(memberDialog).not.toBeVisible()

  await page.getByRole('link', { name: 'Circulation', exact: true }).click()
  await page.getByRole('button', { name: 'Issue loan', exact: true }).click()
  const loanDialog = page.getByRole('dialog')
  await loanDialog
    .getByLabel('Member', { exact: true })
    .selectOption({ label: `Reader ${unique} (staff-reader-${unique}@test.local)` })
  await loanDialog
    .getByLabel('Available copy', { exact: true })
    .selectOption({ label: `${title} / COPY-${unique} / TEST 1` })
  await loanDialog.getByRole('button', { name: 'Issue loan', exact: true }).click()
  await expect(loanDialog).not.toBeVisible()
  const loanRow = page.getByRole('row').filter({ hasText: title })
  await loanRow.getByRole('button', { name: 'Renew', exact: true }).click()
  await expect(page.getByText('Renewed.', { exact: true })).toBeVisible()
  await loanRow.getByRole('button', { name: 'Return', exact: true }).click()
  await page.getByRole('dialog').getByRole('button', { name: 'Confirm return' }).click()
  await expect(loanRow).not.toBeVisible()
  await page.getByRole('button', { name: 'All history' }).click()
  await expect(
    page.getByRole('row').filter({ hasText: title }).getByText('returned', { exact: true }),
  ).toBeVisible()
})

test('public information pages explain the library and current borrowing rules', async ({
  page,
}) => {
  await page.goto('/about')
  await expect(page.getByRole('heading', { name: /A shared place/ })).toBeVisible()
  await page.screenshot({ path: 'docs/previews/about-desktop.png', fullPage: true })
  await page.goto('/faq')
  await expect(page.getByRole('heading', { name: /Borrowing, made clear/ })).toBeVisible()
  await expect(page.locator('.public-policy-grid')).toBeVisible()
  await page.locator('summary').first().click()
  await expect(page.locator('details').first()).toHaveAttribute('open', '')
  await page.setViewportSize({ width: 375, height: 812 })
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
})

test('header offers member registration without a brand subtitle', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await page.goto('/')
  await expect(page.locator('.public-header .brand')).toHaveText('Khaliil Library')
  await page.getByRole('link', { name: 'Register', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Become a member' })).toBeVisible()
  await expect(page.getByLabel('Full name')).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  await page.goto('/about')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(
    true,
  )
  await page.screenshot({ path: 'docs/previews/about-mobile.png', fullPage: true })
})

test('Help is a contact page with a separate FAQ destination', async ({ page }) => {
  await page.goto('/help')
  await expect(page.getByRole('heading', { name: 'Contact us.' })).toBeVisible()
  await page.getByRole('link', { name: 'Read the FAQs' }).click()
  await expect(page).toHaveURL(/\/faq$/)
  await expect(page.getByRole('heading', { name: 'Frequently asked questions' })).toBeVisible()
})

test('contact form saves a message, shows a dismissible toast, and header stays fixed', async ({
  page,
}) => {
  await page.goto('/help')
  await page.getByLabel('Full name').fill('Contact Reader')
  await page.getByLabel('Email address').fill('contact-reader@test.local')
  await page.getByLabel('What is your message about?').selectOption('Borrowing')
  await page
    .getByLabel('Message', { exact: true })
    .fill('Please explain how to collect a reserved book.')
  await page.getByRole('button', { name: 'Send message', exact: true }).click()
  await expect(
    page.getByText('Your message has been sent to the library team.', { exact: true }),
  ).toBeVisible()
  await page
    .locator('[data-sonner-toast]')
    .getByRole('button', { name: /Close toast/i })
    .click()
  await page.evaluate(() => window.scrollTo(0, 600))
  expect(
    await page
      .locator('.public-header')
      .evaluate((element) => Math.round(element.getBoundingClientRect().top)),
  ).toBe(0)
  await expect(
    page
      .getByRole('navigation', { name: 'Main navigation' })
      .getByRole('link', { name: 'FAQ', exact: true }),
  ).toBeVisible()
})

test('reader can request recovery and use a one-time email link from the local test outbox', async ({
  page,
}) => {
  const email = `recovery-${Date.now()}@test.local`
  await page.goto('/register')
  await page.getByLabel('Full name').fill('Recovery Reader')
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password', { exact: true }).fill('Original-reader-password-2026')
  await page.getByLabel('Confirm password', { exact: true }).fill('Original-reader-password-2026')
  await page.getByRole('button', { name: 'Create account', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Welcome back, Recovery' })).toBeVisible()
  await page.getByRole('button', { name: 'Sign out', exact: true }).click()
  await page.goto('/login')
  await page.getByRole('link', { name: 'Forgot password?' }).click()
  await page.getByLabel('Email address').fill(email)
  await page.getByRole('button', { name: 'Send reset link' }).click()
  await expect(page.locator('.recovery-result')).toBeVisible()
  await page.goto('/login')
  await page.getByLabel('Email address').fill('admin@biblioteca.local')
  await page.getByLabel('Password', { exact: true }).fill('E2E-library-admin-password-2026')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await page.getByRole('link', { name: 'Email outbox', exact: true }).click()
  const resetMail = page
    .locator('.email-entry')
    .filter({ hasText: email })
    .filter({ hasText: 'Reset your library password' })
  await resetMail.locator('summary').click()
  const text = await resetMail.locator('pre').innerText()
  const token = text.match(/token=([a-f0-9]{64})/)![1]
  await page.goto(`/reset-password?token=${token}`)
  await page.getByLabel('New password', { exact: true }).fill('Updated-reader-password-2026')
  await page.getByLabel('Confirm new password').fill('Updated-reader-password-2026')
  await page.getByRole('button', { name: 'Update password' }).click()
  await expect(page.locator('.recovery-result')).toContainText('Password updated')
  await page.goto('/login')
  await page.getByLabel('Email address').fill(email)
  await page.getByLabel('Password', { exact: true }).fill('Updated-reader-password-2026')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await expect(page.getByRole('heading', { name: 'Welcome back, Recovery' })).toBeVisible()
})

test('administrator can edit public library details and browse paginated inventory', async ({
  page,
}) => {
  await page.goto('/login')
  await page.getByLabel('Email address').fill('admin@biblioteca.local')
  await page.getByLabel('Password', { exact: true }).fill('E2E-library-admin-password-2026')
  await page.getByRole('button', { name: 'Sign in', exact: true }).click()
  await page.getByRole('link', { name: 'Library details', exact: true }).click()
  await page.getByLabel('Opening hours').fill('Open 24 hours, every day')
  await page.getByLabel('Color preset').selectOption('Ocean')
  await page.getByLabel('Show business name beside logo').uncheck()
  await page.getByRole('button', { name: 'Save library details' }).click()
  await expect(page.getByText('Changes saved.', { exact: true })).toBeVisible()
  await expect(page.locator('.sidebar-brand-header .brand-logo-only')).toBeVisible()
  await expect
    .poll(async () => {
      const header = await page.locator('.sidebar-brand-header').boundingBox()
      const logo = await page.locator('.sidebar-brand-header .brand-logo-only').boundingBox()
      return header && logo ? Math.abs(header.x + header.width / 2 - logo.x - logo.width / 2) : 999
    })
    .toBeLessThan(2)
  await expect(page.getByLabel('Primary color')).toHaveValue('#245b91')
  await page.getByRole('button', { name: 'Switch to dark mode' }).click()
  await expect(page.getByRole('button', { name: 'Save library details' })).toHaveCSS(
    'color',
    'rgb(255, 255, 255)',
  )
  await expect(page.locator('body')).toHaveCSS('color', 'rgb(242, 245, 247)')
  await expect(page.locator('.sidebar nav a')).toHaveText([
    'Overview',
    'Books & copies',
    'Members',
    'Circulation',
    'Reservations',
    'Contact messages',
    'Email outbox',
    'Reports',
    'Admins & staff',
    'Audit history',
    'Loan policies',
    'Library details',
  ])
  await page.goto('/help')
  await expect(page.getByText('+252 616875280', { exact: true })).toBeVisible()
  await expect(page.getByText('Open 24 hours, every day', { exact: true })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Sign in', exact: true })).toHaveCount(0)
  await page.goto('/staff/inventory')
  await expect(page.getByRole('navigation', { name: 'List pagination' })).toBeVisible()
})
