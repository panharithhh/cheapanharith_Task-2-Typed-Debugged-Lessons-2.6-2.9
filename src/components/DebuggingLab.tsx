import React from 'react'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bug, AlertTriangle, ShieldCheck, Activity, Globe, EyeOff } from 'lucide-react'

export interface DebuggingLabProps {
  activeBug: 'none' | 'bug1_crash' | 'bug2_typo' | 'bug3_network'
  onTriggerBug: (bug: 'none' | 'bug1_crash' | 'bug2_typo' | 'bug3_network') => void
}

interface BugSpec {
  id: 'bug1_crash' | 'bug2_typo' | 'bug3_network'
  title: string
  pattern: string
  tool: string
  toolType: 'breakpoint' | 'reactDevTools' | 'networkTab'
  symptom: string
  whatItShowed: string
  fix: string
}

const BUG_SPECS: BugSpec[] = [
  {
    id: 'bug1_crash',
    title: 'Bug 1: Crash (.map() on null state)',
    pattern: 'State Initialization / Unhandled Null',
    tool: 'Sources Tab Breakpoint (Chrome DevTools)',
    toolType: 'breakpoint',
    symptom: 'Application crashes abruptly with a blank white screen upon loading products.',
    whatItShowed:
      'A breakpoint placed right at the render mapping line paused execution immediately prior to the crash. The Scope inspection pane showed `products = null` instead of an Array `[]`.',
    fix: 'Initialize state with fallback `[]` and guard array iterations using nullish coalescing: `(products ?? []).map(...)`.',
  },
  {
    id: 'bug2_typo',
    title: 'Bug 2: Silent Wrong Value (Prop Name Typo)',
    pattern: 'Prop Drilling Typo / Undefined Prop',
    tool: 'React DevTools (Components Tree)',
    toolType: 'reactDevTools',
    symptom: 'Product stock badges always display "Sold Out" even when the item is in stock. Zero console errors appear.',
    whatItShowed:
      'Inspecting the <ProductCard> in the React DevTools component tree revealed the component received `isAvailable: true` (a misspelled prop), while the expected prop `inStock` evaluated to `undefined`.',
    fix: 'Align the parent prop pass to `<ProductCard inStock={product.inStock} ... />`.',
  },
  {
    id: 'bug3_network',
    title: 'Bug 3: Network Failure (Mistyped URL Endpoint)',
    pattern: 'Async Fetch Error / 404 Endpoint Typo',
    tool: 'Network Tab (Chrome DevTools)',
    toolType: 'networkTab',
    symptom: 'Syncing the catalog from external API fails with an error alert, leaving data empty or outdated.',
    whatItShowed:
      'Filtering requests by Fetch/XHR highlighted `GET https://dummyjson.com/productss` highlighted in red with HTTP 404 (Not Found). The Response preview returned `{"message": "Resource not found"}`.',
    fix: 'Correct the mistyped URL from `/productss` to `/products` and verify response.ok.',
  },
]

export function DebuggingLab({
  activeBug,
  onTriggerBug,
}: DebuggingLabProps): React.JSX.Element {
  return (
    <Card className="border-amber-200 bg-amber-50/40">
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white shadow-sm">
              <Bug className="h-4 w-4" />
            </div>
            <div>
              <CardTitle className="text-base text-amber-950">
                Lesson 2.6–2.9 Debugging Laboratory
              </CardTitle>
              <CardDescription className="text-amber-800">
                Live reproduction suite for the 3 planted lesson bugs and diagnostic toolkits.
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant={activeBug === 'none' ? 'default' : 'danger'}
              className="gap-1.5"
            >
              {activeBug === 'none' ? (
                <>
                  <ShieldCheck className="h-3.5 w-3.5" />
                  All Bugs Fixed (Production Mode)
                </>
              ) : (
                <>
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Planted Bug Active: {activeBug}
                </>
              )}
            </Badge>
            {activeBug !== 'none' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onTriggerBug('none')}
                className="h-7 text-xs border-amber-300 bg-white"
              >
                Reset to Fixed State
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
          {BUG_SPECS.map((bug) => {
            const isSelected = activeBug === bug.id
            return (
              <div
                key={bug.id}
                className={`flex flex-col justify-between rounded-lg border p-3.5 transition ${
                  isSelected
                    ? 'border-rose-400 bg-rose-50 shadow-sm'
                    : 'border-amber-200 bg-white hover:border-amber-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-bold text-slate-800 line-clamp-1">
                      {bug.title}
                    </span>
                    {bug.toolType === 'breakpoint' && <Activity className="h-3.5 w-3.5 text-blue-600 shrink-0" />}
                    {bug.toolType === 'reactDevTools' && <EyeOff className="h-3.5 w-3.5 text-cyan-600 shrink-0" />}
                    {bug.toolType === 'networkTab' && <Globe className="h-3.5 w-3.5 text-orange-600 shrink-0" />}
                  </div>

                  <div className="mt-2 space-y-1.5 text-[11px] text-slate-600">
                    <p>
                      <strong className="text-slate-700">Diagnostic Tool:</strong>{' '}
                      <span className="text-emerald-700 font-medium">{bug.tool}</span>
                    </p>
                    <p>
                      <strong className="text-slate-700">Symptom:</strong> {bug.symptom}
                    </p>
                    <p>
                      <strong className="text-slate-700">DevTools Insight:</strong> {bug.whatItShowed}
                    </p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-semibold uppercase text-slate-400">
                    {bug.pattern}
                  </span>
                  <Button
                    variant={isSelected ? 'destructive' : 'outline'}
                    size="sm"
                    onClick={() => onTriggerBug(isSelected ? 'none' : bug.id)}
                    className="h-7 text-xs px-2.5"
                  >
                    {isSelected ? 'Revert Fix' : 'Simulate Bug'}
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
