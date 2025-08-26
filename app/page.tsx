"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, Search, TrendingUp, Users, PieChart, BarChart3 } from "lucide-react"
import { TopFoodsChart } from "@/components/charts/top-foods-chart"
import { FrequencyByFoodChart } from "@/components/charts/frequency-by-food-chart"
import { ConsumptionByCategoryChart } from "@/components/charts/consumption-by-category-chart"
import { UserAnalysisTable } from "@/components/user-analysis-table"

interface TopFood {
  alimento: string
  total: number
}

interface FrequencyByFood {
  alimento: string
  frecuencia: string
  total: number
}

interface ConsumptionByCategory {
  categoria: string
  frecuencia: string
  total: number
}

interface UserResponse {
  alimento: string
  categoria: string
  frecuencia: string
  observaciones: string
}

const MOCK_DATA = {
  topFoods: [
    { alimento: "Rice", total: 245 },
    { alimento: "Chicken", total: 198 },
    { alimento: "Bread", total: 187 },
    { alimento: "Eggs", total: 156 },
    { alimento: "Milk", total: 143 },
    { alimento: "Potatoes", total: 132 },
    { alimento: "Tomatoes", total: 121 },
    { alimento: "Onions", total: 108 },
    { alimento: "Bananas", total: 95 },
    { alimento: "Apples", total: 87 },
  ],
  frequencyByFood: [
    { alimento: "Rice", frecuencia: "Daily", total: 89 },
    { alimento: "Rice", frecuencia: "Weekly", total: 76 },
    { alimento: "Rice", frecuencia: "Monthly", total: 45 },
    { alimento: "Rice", frecuencia: "Never", total: 35 },
    { alimento: "Chicken", frecuencia: "Daily", total: 45 },
    { alimento: "Chicken", frecuencia: "Weekly", total: 87 },
    { alimento: "Chicken", frecuencia: "Monthly", total: 43 },
    { alimento: "Chicken", frecuencia: "Never", total: 23 },
    { alimento: "Bread", frecuencia: "Daily", total: 67 },
    { alimento: "Bread", frecuencia: "Weekly", total: 65 },
    { alimento: "Bread", frecuencia: "Monthly", total: 32 },
    { alimento: "Bread", frecuencia: "Never", total: 23 },
    { alimento: "Eggs", frecuencia: "Daily", total: 34 },
    { alimento: "Eggs", frecuencia: "Weekly", total: 67 },
    { alimento: "Eggs", frecuencia: "Monthly", total: 35 },
    { alimento: "Eggs", frecuencia: "Never", total: 20 },
    { alimento: "Milk", frecuencia: "Daily", total: 56 },
    { alimento: "Milk", frecuencia: "Weekly", total: 45 },
    { alimento: "Milk", frecuencia: "Monthly", total: 25 },
    { alimento: "Milk", frecuencia: "Never", total: 17 },
  ],
  consumptionByCategory: [
    { categoria: "Grains", frecuencia: "Daily", total: 156 },
    { categoria: "Grains", frecuencia: "Weekly", total: 98 },
    { categoria: "Grains", frecuencia: "Monthly", total: 45 },
    { categoria: "Grains", frecuencia: "Never", total: 23 },
    { categoria: "Proteins", frecuencia: "Daily", total: 89 },
    { categoria: "Proteins", frecuencia: "Weekly", total: 134 },
    { categoria: "Proteins", frecuencia: "Monthly", total: 67 },
    { categoria: "Proteins", frecuencia: "Never", total: 34 },
    { categoria: "Vegetables", frecuencia: "Daily", total: 78 },
    { categoria: "Vegetables", frecuencia: "Weekly", total: 123 },
    { categoria: "Vegetables", frecuencia: "Monthly", total: 56 },
    { categoria: "Vegetables", frecuencia: "Never", total: 28 },
    { categoria: "Fruits", frecuencia: "Daily", total: 45 },
    { categoria: "Fruits", frecuencia: "Weekly", total: 87 },
    { categoria: "Fruits", frecuencia: "Monthly", total: 43 },
    { categoria: "Fruits", frecuencia: "Never", total: 21 },
    { categoria: "Dairy", frecuencia: "Daily", total: 67 },
    { categoria: "Dairy", frecuencia: "Weekly", total: 54 },
    { categoria: "Dairy", frecuencia: "Monthly", total: 32 },
    { categoria: "Dairy", frecuencia: "Never", total: 18 },
  ],
  userResponses: {
    "12345678": [
      { alimento: "Rice", categoria: "Grains", frecuencia: "Daily", observaciones: "Main staple food" },
      { alimento: "Chicken", categoria: "Proteins", frecuencia: "Weekly", observaciones: "Usually on weekends" },
      { alimento: "Broccoli", categoria: "Vegetables", frecuencia: "Weekly", observaciones: "Good source of vitamins" },
      { alimento: "Milk", categoria: "Dairy", frecuencia: "Daily", observaciones: "With breakfast cereal" },
      { alimento: "Bananas", categoria: "Fruits", frecuencia: "Daily", observaciones: "Post-workout snack" },
    ],
    "87654321": [
      { alimento: "Bread", categoria: "Grains", frecuencia: "Daily", observaciones: "For breakfast and lunch" },
      { alimento: "Eggs", categoria: "Proteins", frecuencia: "Daily", observaciones: "Scrambled or boiled" },
      { alimento: "Tomatoes", categoria: "Vegetables", frecuencia: "Weekly", observaciones: "In salads mostly" },
      { alimento: "Apples", categoria: "Fruits", frecuencia: "Weekly", observaciones: "Healthy snack option" },
    ],
  },
}

export default function Dashboard() {
  const [topFoods, setTopFoods] = useState<TopFood[]>([])
  const [frequencyByFood, setFrequencyByFood] = useState<FrequencyByFood[]>([])
  const [consumptionByCategory, setConsumptionByCategory] = useState<ConsumptionByCategory[]>([])
  const [userResponses, setUserResponses] = useState<UserResponse[]>([])
  const [searchDni, setSearchDni] = useState("")
  const [loading, setLoading] = useState({
    topFoods: true,
    frequency: true,
    category: true,
    user: false,
  })
  const [errors, setErrors] = useState({
    topFoods: "",
    frequency: "",
    category: "",
    user: "",
  })

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://form-nutri-backend.onrender.com"
  const USE_MOCK_DATA = false // Try API first, fallback to mock if needed

  const fetchData = async (endpoint: string, setter: Function, loadingKey: string) => {
    try {
      setLoading((prev) => ({ ...prev, [loadingKey]: true }))
      setErrors((prev) => ({ ...prev, [loadingKey]: "" }))

      console.log(`[v0] Attempting to fetch: ${API_BASE}${endpoint}`)
      const response = await fetch(`${API_BASE}${endpoint}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log(`[v0] Successfully fetched ${endpoint}:`, data)
      setter(data)
    } catch (error) {
      console.error(`[v0] Error fetching ${endpoint}:`, error)

      let mockData
      switch (loadingKey) {
        case "topFoods":
          mockData = MOCK_DATA.topFoods
          break
        case "frequency":
          mockData = MOCK_DATA.frequencyByFood
          break
        case "category":
          mockData = MOCK_DATA.consumptionByCategory
          break
        default:
          mockData = []
      }

      console.log(`[v0] Using mock data for ${endpoint}:`, mockData)
      setter(mockData)

      setErrors((prev) => ({
        ...prev,
        [loadingKey]: `API unavailable - showing demo data. Backend error: ${error.message}`,
      }))
    } finally {
      setLoading((prev) => ({ ...prev, [loadingKey]: false }))
    }
  }

  const fetchUserData = async (dni: string) => {
    if (!dni.trim()) return

    try {
      setLoading((prev) => ({ ...prev, user: true }))
      setErrors((prev) => ({ ...prev, user: "" }))

      console.log(`[v0] Attempting to fetch user data: ${API_BASE}/stats/user/${dni}`)
      const response = await fetch(`${API_BASE}/stats/user/${dni}`)

      if (!response.ok) {
        if (response.status === 404) {
          const mockUserData = MOCK_DATA.userResponses[dni as keyof typeof MOCK_DATA.userResponses]
          if (mockUserData) {
            console.log(`[v0] Using mock data for user ${dni}:`, mockUserData)
            setUserResponses(mockUserData)
            setErrors((prev) => ({
              ...prev,
              user: `API unavailable - showing demo data for DNI: ${dni}`,
            }))
            return
          }

          setErrors((prev) => ({
            ...prev,
            user: `No data found for DNI: ${dni}. Try demo DNIs: 12345678 or 87654321`,
          }))
          setUserResponses([])
          return
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log(`[v0] Successfully fetched user data:`, data)
      setUserResponses(data.respuestas || [])
    } catch (error) {
      console.error(`[v0] Error fetching user data:`, error)

      const mockUserData = MOCK_DATA.userResponses[dni as keyof typeof MOCK_DATA.userResponses]
      if (mockUserData) {
        console.log(`[v0] Using mock data for user ${dni}:`, mockUserData)
        setUserResponses(mockUserData)
        setErrors((prev) => ({
          ...prev,
          user: `API unavailable - showing demo data for DNI: ${dni}`,
        }))
      } else {
        setErrors((prev) => ({
          ...prev,
          user: `Backend unavailable. Try demo DNIs: 12345678 or 87654321`,
        }))
        setUserResponses([])
      }
    } finally {
      setLoading((prev) => ({ ...prev, user: false }))
    }
  }

  useEffect(() => {
    fetchData("/stats/top-foods", setTopFoods, "topFoods")
    fetchData("/stats/frequency-by-food", setFrequencyByFood, "frequency")
    fetchData("/stats/by-category", setConsumptionByCategory, "category")
  }, [])

  const handleUserSearch = () => {
    fetchUserData(searchDni)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUserSearch()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Food Analytics Dashboard</h1>
              <p className="text-muted-foreground mt-1">Comprehensive insights into food consumption patterns</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-3 py-1">
                <TrendingUp className="w-4 h-4 mr-1" />
                {errors.topFoods || errors.frequency || errors.category ? "Demo Data (API Fallback)" : "Live Data"}
              </Badge>
            </div>
          </div>
          <div className="mt-4 p-3 bg-primary/10 border border-primary/20 rounded-md">
            <p className="text-sm text-primary">
              <strong>Status:</strong>{" "}
              {errors.topFoods || errors.frequency || errors.category
                ? "Backend API unavailable - showing demo data with full functionality. Charts and user search work with sample data."
                : "Connected to live backend API. All data is real-time from your database."}
            </p>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Foods Tracked</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{topFoods.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Categories</CardTitle>
              <PieChart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {[...new Set(consumptionByCategory.map((item) => item.categoria))].length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {topFoods.reduce((sum, food) => sum + food.total, 0)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{topFoods[0]?.alimento || "Loading..."}</div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Foods Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Top Foods Consumed
              </CardTitle>
              <CardDescription>Ranking of most consumed foods based on total responses</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.topFoods ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {errors.topFoods && (
                    <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                      {errors.topFoods}
                    </div>
                  )}
                  <TopFoodsChart data={topFoods} />
                </>
              )}
            </CardContent>
          </Card>

          {/* Frequency by Food Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Frequency Distribution
              </CardTitle>
              <CardDescription>How often different foods are consumed (Never, Monthly, Weekly, Daily)</CardDescription>
            </CardHeader>
            <CardContent>
              {loading.frequency ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {errors.frequency && (
                    <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                      {errors.frequency}
                    </div>
                  )}
                  <FrequencyByFoodChart data={frequencyByFood} />
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Category Consumption Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-primary" />
              Consumption by Category
            </CardTitle>
            <CardDescription>Distribution of food consumption across different categories</CardDescription>
          </CardHeader>
          <CardContent>
            {loading.category ? (
              <div className="flex items-center justify-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : (
              <>
                {errors.category && (
                  <div className="mb-4 p-2 bg-amber-50 border border-amber-200 rounded text-sm text-amber-800">
                    {errors.category}
                  </div>
                )}
                <ConsumptionByCategoryChart data={consumptionByCategory} />
              </>
            )}
          </CardContent>
        </Card>

        {/* User Analysis Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              User Analysis
            </CardTitle>
            <CardDescription>
              Search for specific user responses by DNI
              {errors.topFoods || errors.frequency || errors.category
                ? " (Demo mode - try DNIs: 12345678 or 87654321)"
                : " (Enter a valid DNI from your database)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <Input
                  placeholder={
                    errors.topFoods || errors.frequency || errors.category
                      ? "Enter DNI (try: 12345678 or 87654321)"
                      : "Enter DNI to search user responses..."
                  }
                  value={searchDni}
                  onChange={(e) => setSearchDni(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="bg-input"
                />
              </div>
              <Button
                onClick={handleUserSearch}
                disabled={loading.user || !searchDni.trim()}
                className="bg-primary hover:bg-primary/90"
              >
                {loading.user ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Search className="w-4 h-4 mr-2" />}
                Search
              </Button>
            </div>

            {errors.user && (
              <div
                className={`mb-4 p-3 rounded-md ${
                  errors.user.includes("demo data") || errors.user.includes("Demo DNIs")
                    ? "bg-amber-50 border border-amber-200 text-amber-800"
                    : "bg-destructive/10 text-destructive"
                }`}
              >
                {errors.user}
              </div>
            )}

            {userResponses.length > 0 && <UserAnalysisTable data={userResponses} dni={searchDni} />}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
